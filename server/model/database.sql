CREATE SCHEMA projekt;

DROP TABLE projekt.register;
DROP TABLE projekt.token;

CREATE TABLE projekt.register(
  register_id SERIAL,
  CONSTRAINT register_pk PRIMARY KEY (register_id),
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  roles jsonb
);

CREATE TABLE projekt.token (
  register_id INTEGER NOT NULL,
  CONSTRAINT token_pk PRIMARY KEY (register_id),
  token VARCHAR(255)
);

DROP FUNCTION projekt.getuser(VARCHAR,VARCHAR);

CREATE OR REPLACE FUNCTION projekt.getuser( _email VARCHAR, _password VARCHAR)
RETURNS BOOLEAN
AS $$
BEGIN
    RETURN EXISTS ( SELECT 1 FROM projekt.register WHERE email LIKE _email AND password LIKE _password);
END
$$ LANGUAGE plpgsql;

SELECT * FROM projekt.register;
INSERT INTO projekt.register (firstName,lastName,email,password,roles) VALUES('b','b','b','b','{"User":2001,"Editor":1984}');
INSERT INTO projekt.token VALUES(1,'b');
UPDATE projekt.register SET firstName = 'c', lastName= 'c', email='a', password='c' WHERE email = 'a';
DELETE FROM projekt.register WHERE email='asd'
SELECT * FROM projekt.getuser('a','a') ;
