FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=marido_aluguel
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=1234

# Copia o init.sql para o local que o MySQL usa para inicializar dados
COPY init.sql /docker-entrypoint-initdb.d/