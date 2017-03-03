use jaksve; # Byt till din egen

drop table users; # Radera om redan finns
drop table favorites;
drop table comments;
drop table stocks;

create table users (
	id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
			 email varchar(64),
			 password varchar(128),
	PRIMARY KEY (id)
);

create table stocks (
	id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       symbol varchar(256),
       exchange varchar(256),
	PRIMARY KEY (id)
);

create table favorites (
	id int NOT NULL AUTO_INCREMENT,
		stock_id varchar(64),
		user_id varchar(64),
	FOREIGN KEY (stock_id) REFERENCES stocks.id,
	FOREIGN KEY (user_id) REFERENCES users.id,
	PRIMARY KEY (id)
);

create table comments (
	id int NOT NULL AUTO_INCREMENT,
       content varchar(256),
       author varchar(64),
       createdAt varchar(64),
			 updatedAt varchar(64),
			 stock varchar(64),
	FOREIGN KEY (author) REFERENCES users.id,
	FOREIGN KEY (stock) REFERENCES stocks.id,
	PRIMARY KEY (id)
);
