FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

WORKDIR /usr/src/

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY ./src .

CMD [ "python3", "-m" , "flask", "run","--reload", "--host=0.0.0.0"]