FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD=root
COPY ./scripts /docker-entrypoint-initdb.d/
EXPOSE 3306