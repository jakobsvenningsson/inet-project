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
	stockId varchar(64),
	userId varchar(64),
	FOREIGN KEY (stockId) REFERENCES stocks.id,
	FOREIGN KEY (userId) REFERENCES users.id,
	PRIMARY KEY (stockId, userId)
);

create table comments (
	id int NOT NULL AUTO_INCREMENT,
       content varchar(256),
       userId varchar(64),
       createdAt varchar(64),
			 updatedAt varchar(64),
			 stockId varchar(64),
	FOREIGN KEY (userId) REFERENCES users.id,
	FOREIGN KEY (stockId) REFERENCES stocks.id,
	PRIMARY KEY (id)
);
