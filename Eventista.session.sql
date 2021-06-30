CREATE TABLE Attendee(
  Att_username varchar(16),
  AttEmail varchar(30),
  AttName varchar(30),
  AttPassword varchar(15),
  DateOfBirth date,
  Age int as (year(CURRENT_TIMESTAMP) - year(DateOfBirth)),
  primary key (Att_username)
);
CREATE TABLE Organizer(
  Org_username varchar(16),
  OrgEmail varchar(30),
  OrgName varchar(30),
  OrgPassword varchar(15),
  ContactNo char(10),
  constraint chk_no check (ContactNo NOT LIKE '%[^0-9]%'),
  Organisation varchar(50),
  primary key (Org_username)
);
CREATE TABLE Events(
  Org_username varchar(16),
  EventId int AUTO_INCREMENT,
  Category varchar(15),
  GoldTicketPrice numeric(4, 0),
  DiamondTicketPrice numeric(4, 0),
  PlatinumTicketPrice numeric(4, 0),
  NOParticipants numeric(3, 0),
  MaxParticipants numeric(3, 0),
  Ename varchar(30),
  primary key (EventId),
  foreign key (Org_username) references Organizer(Org_username)
);
ALTER TABLE
  Events AUTO_INCREMENT = 100;
CREATE TABLE Details(
    EventId int,
    Deadline date,
    Venue varchar(30),
    DOEvent date,
    Description varchar(500),
    Poster varchar(100),
    primary key (EventId),
    foreign key (EventId) references EVENTS (EventId)
  );
CREATE TABLE Tickets(
    Att_username varchar(16),
    EventId int,
    TicketId int AUTO_INCREMENT,
    TypeOfticket varchar(9),
    constraint chk_typ check (TypeOfticket in ('Gold', 'Diamond', 'Platinum')),
    NOTickets numeric(2, 0),
    TotalPrice numeric(6, 0),
    primary key (TicketId),
    foreign key (Att_username) references Attendee(Att_username),
    foreign key (EventId) references Events(EventId)
  );
CREATE TABLE Bookmarks(
    Att_username varchar(16),
    EventId int,
    BookmarkId int AUTO_INCREMENT,
    primary key (BookmarkId),
    foreign key (Att_username) references Attendee(Att_username),
    foreign key (EventId) references Events(EventId)
  );
ALTER TABLE
  Bookmarks AUTO_INCREMENT = 200;
CREATE TABLE EveSocialMedia(
    EventId int,
    Instagram varchar(50),
    Facebook varchar(50),
    Twitter varchar(50),
    LinkedIn varchar(50),
    primary key (EventId),
    foreign key (EventId) references Events(EventId)
  );
CREATE TABLE OrgSocialMedia(
    Org_username varchar(16),
    Instagram varchar(50),
    Facebook varchar(50),
    Twitter varchar(50),
    LinkedIn varchar(50),
    primary key (Org_username),
    foreign key (Org_username) references Organizer(Org_username)
  );
insert into
  organizer
values(
    "aminick",
    "nikhil163@gmail.com",
    "Nikhil Kumar",
    "123nikhil",
    "9829854639",
    "IIIT Vadodara"
  );



insert into
  events(
    Org_username,
    Category,
    GoldTicketPrice,
    DiamondTicketPrice,
    PlatinumTicketPrice,
    NOParticipants,
    MaxParticipants,
    Ename
  )
values(
    "aminick",
    "Open Mic",
    150,
    200,
    350,
    21,
    50,
    "Jazz Night"
  );



insert into
  details(EventID,Deadline,Venue,DOEvent,Description,Poster)
values(
    "102",
    "2021-05-10",
    "New Delhi",
    "2021-05-23",
    "It is the annual Event of The Oddball Beats Society.
Here various open-mic artist will perform and it would be a night worth remebering. So don't just sit back and wait.",
    "img/openmic.png"
  );


 