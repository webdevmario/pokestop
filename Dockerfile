FROM postgres:13

ENV POSTGRES_PASSWORD=mypassword

EXPOSE 5432

CMD ["postgres"]