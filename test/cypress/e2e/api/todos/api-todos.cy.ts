import { BackendType } from "../../../constants";

describe('Get todos', () => {
  it('should return the list of todos properly on go', async () => {
    const backend = BackendType.Go

    cy.setCookie('tt-be', backend);
    const response = await cy.request("GET", "http://localhost:20700/api/todos")
    expect(response.status).to.eq(200);
    expect(response.body.origin).to.eq(backend);
    expect(response.body.total).to.be.greaterThan(0);
    expect(response.body.data).length.to.be.greaterThan(0);
    expect(response.body.data[0].id).not.to.be.undefined;
    expect(response.body.data[0].content).not.to.be.undefined;
    expect(response.body.data[0].dateCreated).not.to.be.undefined;
    expect(response.body.data[0].dateUpdated).not.to.be.undefined;
    expect(response.body.data[0].order).not.to.be.undefined;
  });
  it('should return the list of todos properly on python', async () => {
    const backend = BackendType.Python

    cy.setCookie('tt-be', backend);
    const response = await cy.request("GET", "http://localhost:20700/api/todos")
    expect(response.status).to.eq(200);
    expect(response.body.origin).to.eq(backend);
    expect(response.body.total).to.be.greaterThan(0);
    expect(response.body.data).length.to.be.greaterThan(0);
    expect(response.body.data[0].id).not.to.be.undefined;
    expect(response.body.data[0].content).not.to.be.undefined;
    expect(response.body.data[0].dateCreated).not.to.be.undefined;
    expect(response.body.data[0].dateUpdated).not.to.be.undefined;
    expect(response.body.data[0].order).not.to.be.undefined;
  });
})