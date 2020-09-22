/* Erase Database*/
drop table if exists "user", "location", "activity" cascade;
drop trigger if exists "check_location" on "location" cascade;
drop type "user_type", "activity_type" cascade;

--------------------------------------- TABLES N TYPES -----------------------------------------------------------------

create type "user_type" as enum ('ADMIN', 'USER');

create type "activity_type" as enum ('STILL', 'ON_FOOT', 'WALKING', 'ON_BICYCLE', 'IN_VEHICLE', 'TILTING', 'EXITING_VEHICLE');


create table "user"
(
    "id"          serial      not null primary key,
    "type"        user_type   not null,
    "name"        varchar(50) not null,
    "password"    varchar(50) not null,
    "email"       varchar(50) not null unique,
    "last_upload" timestamp
);

create table "location"
(
    "id"        serial                 not null primary key,
    "user_id"   int                    not null,
    "timestamp" timestamp              not null,
    "geog"      geography(point, 4326) not null,
    constraint "fk_user"
        foreign key ("user_id")
            references "user" ("id")
            on update cascade on delete cascade
);

create table "activity"
(
    "id"          serial        not null primary key,
    "location_id" int           not null,
    "user_id"     int           not null,
    "timestamp"   timestamp     not null,
    "type"        activity_type not null,
    constraint "fk_location"
        foreign key ("location_id")
            references "location" ("id")
            on update cascade on delete cascade
);

create or replace function check_location() returns trigger as
$$
begin
    if ST_Distance(
               ST_GeographyFromText('POINT(38.230462,21.753150)', 4326),
               new.geog) > 10000 then
        raise exception 'Coordinates not in a valid range.';
    end if;
    return new;
end;
$$ language plpgsql;


-- create trigger check_location
--     before insert
--     on "location"
--     for each statement
-- execute procedure check_location();

--------------------------------------- USER FUNCTIONS -----------------------------------------------------------------

create or replace function user_records_per_activity(user_id int)
    returns table
            (
                "type"   activity_type,
                "amount" int
            )
as
$$
    # variable_conflict use_variable
begin
    select "type",
           count("type") as "records"
    from "activity"
    where "activity"."user_id" = "user_id"
    group by "type";
end;
$$ language plpgsql;

create or replace function user_eco_score(user_id int) returns decimal as
$$
    # variable_conflict use_variable
declare
    count1 integer;
    count2 integer;
begin
    select into count1 count(*)::decimal
    from "activity"
    where "activity"."user_id" = user_id
      and eco_friendly("activity"."type") = true;
    select into count2 count(*)::decimal
    from "activity"
    where "activity"."user_id" = user_id
      and eco_friendly("activity"."type") = false;
    select count1 / count2;
end;
$$ language plpgsql;

create or replace view user_leaderboard as
select "name",
       user_eco_score("id")
from "user"
order by user_eco_score("id") desc
limit 3;

create or replace function eco_friendly(type activity_type) returns boolean as
$$
declare
    type activity_type;
begin
    if "type" = 'VEHICLE' then
        return false;
    else
        return true;
    end if;
end;
$$ language plpgsql;

create or replace function user_last_upload(user_id int) returns timestamp as
$$
    # variable_conflict use_variable
begin
    select min("timestamp")
    from "activity"
    where "activity"."user_id" = "user_id";
end;
$$ language plpgsql;


create or replace function user_records_interval(user_id int)
    returns table
            (
                t timestamp
            )
as
$$
    # variable_conflict use_variable
declare
    a timestamp;
    b timestamp;
begin
    select max("timestamp") into a from "activity" where "activity"."user_id" == "user_id";
    select min("timestamp") into b from "activity" where "activity"."user_id" == "user_id";
    select a, b;
end;
$$ language plpgsql;

create or replace function user_activity_points(user_id int, area geography(polygon, 4326), start_year int,
                                                end_year int,
                                                start_month int, end_month int)
    returns table
            (
                geog geography(point, 4326)
            )
as
$$
    # variable_conflict use_variable
begin
    select "location"."geog"
    from "user"
             inner join "location" on "user"."id" = "location"."user_id" and ST_Intersects("location"."geog", area)
             inner join "activity" on "location"."id" = "activity"."location_id"
    where "activity"."user_id" = "user_id"
      and extract(YEAR from "activity"."timestamp") >= start_year
      and extract(YEAR from "activity"."timestamp") =< end_year
      and extract(YEAR from "activity"."timestamp") >= start_month
      and extract(YEAR from "activity"."timestamp") =< end_month;
end;
$$ language plpgsql;

create or replace function user_day_with_most_activities(user_id int) returns int as
$$
    # variable_conflict use_variable
begin
    select extract(HOUR from "activity"."timestamp") as hour
    from activity
    where "activity"."id" = "user_id"
    group by extract(DAY from "activity"."timestamp")
    order by count("activity"."id") desc
    limit 1;
end;
$$ language plpgsql;

create or replace function user_hour_with_most_activities(user_id int) returns int as
$$
    # variable_conflict use_variable
begin
    select extract(HOUR from "activity"."timestamp") as hour
    from activity
    where "activity"."id" = "user_id"
    group by extract(HOUR from "activity"."timestamp")
    order by count("activity"."id") desc
    limit 1;
end;
$$ language plpgsql;

------------------------------------- ADMIN FUNCTIONS -----------------------------------------------------------------
insert into "user" ("type", "name", "password", "email")
values ('ADMIN', 'admin', 'password', 'admin@example.com');

create or replace function admin_records_per_user()
    returns table
            (
                user_id int,
                cnt     int
            )
as
$$
    # variable_conflict use_column
begin
    select "user_id", count("activity"."id") as cnt
    from activity
    group by "activity"."user_id";
end;
$$ language plpgsql;

create or replace function admin_records_per_year()
    returns table
            (
                year int,
                cnt  int
            )
as
$$
begin
    select extract(YEAR from "activity"."timestamp") as year, count("activity"."id") as cnt
    from activity
    group by year
    order by year;
end;
$$ language plpgsql;

create or replace function admin_records_per_month()
    returns table
            (
                month int,
                cnt   int
            )
as
$$
begin
    select extract(MONTH from "activity"."timestamp") as month, count("activity"."id") as cnt
    from activity
    group by month
    order by month;
end;
$$ language plpgsql;

create or replace function admin_records_per_day()
    returns table
            (
                day int,
                cnt int
            )
as
$$
begin
    select extract(DAY from "activity"."timestamp") as day, count("activity"."id") as cnt
    from activity
    group by day
    order by day;
end;
$$ language plpgsql;

create or replace function admin_records_per_hour()
    returns table
            (
                hour int,
                cnt  int
            )
as
$$
begin
    select extract(HOUR from "activity"."timestamp") as hour, count("activity"."id") as cnt
    from activity
    group by hour
    order by hour;
end;
$$ language plpgsql;

create or replace function admin_activities(area geography(polygon, 4326), start_year int, end_year int,
                                            start_month int, end_month int, start_hour int, end_hour int)
    returns table
            (
                geog geography(point, 4326)
            )
as
$$
begin
    select "location"."geog"
    from "user"
             inner join "location" on "user"."id" = "location"."user_id" and ST_Intersects("location"."geog", area)
             inner join "activity" on "location"."id" = "activity"."location_id"
    where extract(YEAR from "activity"."timestamp") >= start_year
      and extract(YEAR from "activity"."timestamp") =< end_year
      and extract(YEAR from "activity"."timestamp") >= start_month
      and extract(YEAR from "activity"."timestamp") =< end_month
      and extract(HOUR from "activity"."timestamp") >= start_hour
      and extract(HOUR from "activity"."timestamp") =< end_hour;
end;
$$ language plpgsql;