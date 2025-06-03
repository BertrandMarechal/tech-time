FROM python:3.9.22-alpine3.22

WORKDIR /usr/src/

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY ./src .

ENV FLASK_DEBUG=1
ENV FLASK_APP=app.py

ENTRYPOINT ["python3"]
CMD ["app.py", "--host=0.0.0.0", "--reload"]