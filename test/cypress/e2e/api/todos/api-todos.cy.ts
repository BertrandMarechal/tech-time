import { BackendType } from "../../../constants";

const COUNT = 10;

interface Todo {
    id: number;
    content: string;
    order: number;
    dateUpdated: string;
    dateCreated: string;
}

function testTodoLifecycle(backend: BackendType) {
    cy.setCookie('tt-be', backend);
    let firstContent!: Todo;
    const firstContentContent = `${Math.round(Math.random() * 100000)}`;
    const firstContentUpdatedContent = `${Math.round(Math.random() * 100000)}`;

    return cy.request("DELETE", "/api/todos").then((response) => {
        expect(response.status).to.eq(204);
        return cy.request("POST", "/api/todos", { content: firstContentContent });
    }).then((response) => {
        expect(response.status).to.eq(201);
        return cy.request("GET", "/api/todos");
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.origin).to.eq(backend);
        expect(response.body.total).to.be.greaterThan(0);
        expect(response.body.data).length.to.be.greaterThan(0);
        expect(response.body.data[0].id).not.to.be.undefined;
        expect(response.body.data[0].content).not.to.be.undefined;
        expect(response.body.data[0].content).to.equal(firstContentContent);
        expect(response.body.data[0].dateCreated).not.to.be.undefined;
        expect(response.body.data[0].dateUpdated).not.to.be.undefined;
        expect(response.body.data[0].order).not.to.be.undefined;
        firstContent = response.body.data[0];

        return cy.request("PUT", `/api/todos/${firstContent.id}`, { content: firstContentUpdatedContent });
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.equal(firstContent.id);
        expect(response.body.content).to.equal(firstContentUpdatedContent);
        expect(response.body.dateCreated).to.equal(firstContent.dateCreated);
        // todo fix that
        // expect(response.body.dateUpdated).not.to.equal(firstContent.dateUpdated);
        expect(response.body.order).to.equal(firstContent.order);

        firstContent = response.body;

        return cy.request("DELETE", `/api/todos/${firstContent.id}`);
    }).then((response) => {
        expect(response.status).to.eq(204);
    });
}

function setUpTodos(count: number, current = 0) {
    if (current === 0) {
        return cy.request("DELETE", "/api/todos").then((response) => {
            expect(response.status).to.eq(204);
            return cy.request("GET", "/api/todos");
        }).then((response) => {
            expect(response.body.total).to.eq(0);
            return cy.request("POST", "/api/todos", { content: `${count - current}` });
        }).then((response) => {
            expect(response.status).to.eq(201);
            if (count - 1 > current) {
                return setUpTodos(count, current + 1);
            }
        });
    }
    return cy.request("POST", "/api/todos", { content: `${count - current}` }).then((response) => {
        expect(response.status).to.eq(201);
        if (count - 1 > current) {
            return setUpTodos(count, current + 1);
        }
    });
}

function testTodoPagination(backend: BackendType, count: number) {
    cy.setCookie('tt-be', backend);
    let todos!: Todo[];
    setUpTodos(count).then(() => {
        return cy.request("GET", "/api/todos?size=5").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.origin).to.eq(backend);
            expect(response.body.total).to.eq(count);
            expect(response.body.data.length).to.eq(5);

            return cy.request("GET", "/api/todos?size=-1");
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.origin).to.eq(backend);
            expect(response.body.total).to.eq(count);
            expect(response.body.data.length).to.eq(count);
            todos = response.body.data;

            return cy.request("GET", "/api/todos?size=-1&sort=order&direction=asc");
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.origin).to.eq(backend);
            expect(response.body.total).to.eq(count);
            expect(response.body.data.length).to.eq(count);

            for (let i = 0; i < todos.length; i++) {
                expect(response.body.data[i].id).to.eq(todos[i].id);
            }

            return cy.request("GET", "/api/todos?size=-1&sort=order&direction=desc");
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.origin).to.eq(backend);
            expect(response.body.total).to.eq(count);
            expect(response.body.data.length).to.eq(count);

            // they should now be ordered in the other order
            for (let i = 0; i < todos.length; i++) {
                expect(response.body.data[i].id).to.eq(todos[todos.length - 1 - i].id);
            }
        });
    });
}

function testTodoOrdering(backend: BackendType) {
    const count = 10;
    cy.setCookie('tt-be', backend);
    let todos!: Todo[];
    let currentTodoIds: number[] = [];
    let newTodoIds: number[] = [];
    let originalFirstItemId!: number;
    setUpTodos(count).then(() => {
        return cy.request("GET", "/api/todos?size=-1&sort=order&direction=asc").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.origin).to.eq(backend);
            expect(response.body.total).to.eq(count);
            expect(response.body.data.length).to.eq(count);
            todos = response.body.data;
            currentTodoIds = todos.map(({ id }) => id);
            let currentOrder: number = 0;
            for (let i = 0; i < todos.length; i++) {
                expect(todos[i].order).to.eq(currentOrder + 1);
                currentOrder = todos[i].order;
            }

            originalFirstItemId = todos[0].id;
            // I move the first item by 2
            return cy.request("PUT", `/api/todos/${todos[0].id}/order`, { delta: 2, currentOrder: 1 });
        }).then((response) => {
            expect(response.status).to.eq(200);
            const [id1, id2, id3, ...otherIds] = currentTodoIds;
            currentTodoIds = [id2, id3, id1, ...otherIds];

            // get the todos again
            return cy.request("GET", "/api/todos?size=-1&sort=order&direction=asc");
        }).then((response) => {
            expect(response.status).to.eq(200);
            todos = response.body.data;
            newTodoIds = todos.map(({ id }) => id);
            expect(currentTodoIds).to.deep.eq(newTodoIds);
            let currentOrder: number = 0;
            for (let i = 0; i < todos.length; i++) {
                expect(todos[i].order).to.eq(currentOrder + 1);
                currentOrder = todos[i].order;
            }

            // I move the original first item back to its position
            return cy.request("PUT", `/api/todos/${originalFirstItemId}/order`, { delta: -2, currentOrder: 3 });
        }).then((response) => {
            expect(response.status).to.eq(200);
            const [id2, id3, id1, ...otherIds] = currentTodoIds;
            currentTodoIds = [id1, id2, id3, ...otherIds];

            // get the todos again
            return cy.request("GET", "/api/todos?size=-1&sort=order&direction=asc");
        }).then((response) => {
            expect(response.status).to.eq(200);
            todos = response.body.data;
            newTodoIds = todos.map(({ id }) => id);
            expect(currentTodoIds).to.deep.eq(newTodoIds);
        });
    });
}

describe('Todos', () => {
    describe('Lifecycle', () => {
        it('should work properly on Go', () => {
            testTodoLifecycle(BackendType.Go);
        });
        it('should work properly on Python', () => {
            testTodoLifecycle(BackendType.Python);
        });
    });
    describe('Pagination', () => {
        it('should work properly on Go', () => {
            testTodoPagination(BackendType.Go, COUNT);
        });
        it('should work properly on Python', () => {
            testTodoPagination(BackendType.Python, COUNT);
        });
    });
    describe('Ordering', () => {
        it('should work properly on Go', () => {
            testTodoPagination(BackendType.Go, COUNT);
        });
        it('should work properly on Python', () => {
            testTodoOrdering(BackendType.Python);
        });
    });
});