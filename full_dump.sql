--
-- PostgreSQL database dump
--

\restrict WW2fj26U1tWaI3Q7QwTqVMGiZP1HxIeV0pfgV6kRwAJ7BvggfITVFaTGk9gzvqN

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_FamilyMembers_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_FamilyMembers_status" AS ENUM (
    'Alive',
    'Deceased'
);


ALTER TYPE public."enum_FamilyMembers_status" OWNER TO postgres;

--
-- Name: enum_Reports_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Reports_status" AS ENUM (
    'draft',
    'submitted'
);


ALTER TYPE public."enum_Reports_status" OWNER TO postgres;

--
-- Name: enum_RolePermissions_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_RolePermissions_role" AS ENUM (
    'admin',
    'county_leader',
    'district_leader',
    'clan_leader',
    'town_leader',
    'village_leader',
    'citizen'
);


ALTER TYPE public."enum_RolePermissions_role" OWNER TO postgres;

--
-- Name: enum_Users_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_gender" AS ENUM (
    'Male',
    'Female',
    'Other'
);


ALTER TYPE public."enum_Users_gender" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: Categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Categories_id_seq" OWNER TO postgres;

--
-- Name: Categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Categories_id_seq" OWNED BY public."Categories".id;


--
-- Name: Towns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Towns" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "clanId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Towns" OWNER TO postgres;

--
-- Name: Cells_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cells_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cells_id_seq" OWNER TO postgres;

--
-- Name: Cells_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cells_id_seq" OWNED BY public."Towns".id;


--
-- Name: Clans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Clans" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "districtId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Clans" OWNER TO postgres;

--
-- Name: Comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    "postID" integer NOT NULL,
    "userID" integer NOT NULL,
    comment text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Comments" OWNER TO postgres;

--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comments_id_seq" OWNER TO postgres;

--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: Counties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Counties" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Counties" OWNER TO postgres;

--
-- Name: Districts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Districts" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "countyId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Districts" OWNER TO postgres;

--
-- Name: Districts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Districts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Districts_id_seq" OWNER TO postgres;

--
-- Name: Districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Districts_id_seq" OWNED BY public."Districts".id;


--
-- Name: Documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documents" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    category character varying(255),
    title character varying(255),
    description character varying(255),
    image character varying(255),
    "RecordedBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Documents" OWNER TO postgres;

--
-- Name: Documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Documents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Documents_id_seq" OWNER TO postgres;

--
-- Name: Documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Documents_id_seq" OWNED BY public."Documents".id;


--
-- Name: FamilyMembers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FamilyMembers" (
    id integer NOT NULL,
    household_head_id integer NOT NULL,
    fullname character varying(255) NOT NULL,
    dob timestamp with time zone,
    gender character varying(255),
    relationship character varying(255),
    status public."enum_FamilyMembers_status" DEFAULT 'Alive'::public."enum_FamilyMembers_status",
    dod timestamp with time zone,
    marital_status character varying(255),
    occupation character varying(255),
    notes text,
    county_id integer,
    district_id integer,
    clan_id integer,
    town_id integer,
    village_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FamilyMembers" OWNER TO postgres;

--
-- Name: FamilyMembers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FamilyMembers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FamilyMembers_id_seq" OWNER TO postgres;

--
-- Name: FamilyMembers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FamilyMembers_id_seq" OWNED BY public."FamilyMembers".id;


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(255),
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO postgres;

--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notifications_id_seq" OWNER TO postgres;

--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: Permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permissions" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Permissions" OWNER TO postgres;

--
-- Name: Permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Permissions_id_seq" OWNER TO postgres;

--
-- Name: Permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Permissions_id_seq" OWNED BY public."Permissions".id;


--
-- Name: Posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Posts" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "categoryID" integer NOT NULL,
    title character varying(255),
    description character varying(255),
    image character varying(255),
    status character varying(255),
    county_id integer,
    district_id integer,
    clan_id integer,
    town_id integer,
    village_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Posts" OWNER TO postgres;

--
-- Name: Posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Posts_id_seq" OWNER TO postgres;

--
-- Name: Posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Posts_id_seq" OWNED BY public."Posts".id;


--
-- Name: Provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Provinces_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Provinces_id_seq" OWNER TO postgres;

--
-- Name: Provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Provinces_id_seq" OWNED BY public."Counties".id;


--
-- Name: Reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reports" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    summary text,
    "generatedBy" integer NOT NULL,
    scope character varying(255) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    county_id integer,
    district_id integer,
    clan_id integer,
    town_id integer,
    village_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    status public."enum_Reports_status" DEFAULT 'draft'::public."enum_Reports_status" NOT NULL,
    "sentTo" character varying(255)
);


ALTER TABLE public."Reports" OWNER TO postgres;

--
-- Name: Reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reports_id_seq" OWNER TO postgres;

--
-- Name: Reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reports_id_seq" OWNED BY public."Reports".id;


--
-- Name: Requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Requests" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    reason character varying(255),
    status character varying(255),
    county_id integer,
    district_id integer,
    clan_id integer,
    town_id integer,
    village_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    full_name character varying(255),
    national_id character varying(255),
    phone_number character varying(255),
    household_size integer,
    current_county_id integer,
    current_district_id integer,
    current_clan_id integer,
    current_town_id integer,
    current_village_id integer,
    transfer_type character varying(255),
    move_date timestamp with time zone,
    transfer_duration character varying(255),
    supporting_document character varying(255),
    host_name character varying(255),
    host_phone character varying(255),
    host_relationship character varying(255)
);


ALTER TABLE public."Requests" OWNER TO postgres;

--
-- Name: Requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Requests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Requests_id_seq" OWNER TO postgres;

--
-- Name: Requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Requests_id_seq" OWNED BY public."Requests".id;


--
-- Name: RolePermissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermissions" (
    id integer NOT NULL,
    role public."enum_RolePermissions_role" NOT NULL,
    "permissionId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."RolePermissions" OWNER TO postgres;

--
-- Name: RolePermissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RolePermissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RolePermissions_id_seq" OWNER TO postgres;

--
-- Name: RolePermissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RolePermissions_id_seq" OWNED BY public."RolePermissions".id;


--
-- Name: Sectors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Sectors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sectors_id_seq" OWNER TO postgres;

--
-- Name: Sectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Sectors_id_seq" OWNED BY public."Clans".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    firstname character varying(255),
    lastname character varying(255),
    email character varying(255),
    password character varying(255),
    phone character varying(255),
    gender public."enum_Users_gender",
    code character varying(255),
    status character varying(255),
    image character varying(255),
    role character varying(255) NOT NULL,
    county_id integer,
    nid character varying(255),
    familyinfo character varying(255),
    district_id integer,
    clan_id integer,
    town_id integer,
    village_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Villages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Villages" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "townId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Villages" OWNER TO postgres;

--
-- Name: Villages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Villages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Villages_id_seq" OWNER TO postgres;

--
-- Name: Villages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Villages_id_seq" OWNED BY public."Villages".id;


--
-- Name: Categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories" ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);


--
-- Name: Clans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clans" ALTER COLUMN id SET DEFAULT nextval('public."Sectors_id_seq"'::regclass);


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: Counties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Counties" ALTER COLUMN id SET DEFAULT nextval('public."Provinces_id_seq"'::regclass);


--
-- Name: Districts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Districts" ALTER COLUMN id SET DEFAULT nextval('public."Districts_id_seq"'::regclass);


--
-- Name: Documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents" ALTER COLUMN id SET DEFAULT nextval('public."Documents_id_seq"'::regclass);


--
-- Name: FamilyMembers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FamilyMembers" ALTER COLUMN id SET DEFAULT nextval('public."FamilyMembers_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: Permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions" ALTER COLUMN id SET DEFAULT nextval('public."Permissions_id_seq"'::regclass);


--
-- Name: Posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts" ALTER COLUMN id SET DEFAULT nextval('public."Posts_id_seq"'::regclass);


--
-- Name: Reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reports" ALTER COLUMN id SET DEFAULT nextval('public."Reports_id_seq"'::regclass);


--
-- Name: Requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Requests" ALTER COLUMN id SET DEFAULT nextval('public."Requests_id_seq"'::regclass);


--
-- Name: RolePermissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermissions" ALTER COLUMN id SET DEFAULT nextval('public."RolePermissions_id_seq"'::regclass);


--
-- Name: Towns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Towns" ALTER COLUMN id SET DEFAULT nextval('public."Cells_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: Villages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Villages" ALTER COLUMN id SET DEFAULT nextval('public."Villages_id_seq"'::regclass);


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" (id, name, "createdAt", "updatedAt") FROM stdin;
1	minutes	2026-02-24 01:38:42.275+02	2026-02-24 01:38:42.275+02
2	announcements	2026-02-24 01:38:42.275+02	2026-02-24 01:38:42.275+02
3	news updates	2026-02-24 01:38:42.275+02	2026-02-24 01:38:42.275+02
4	emergency alerts	2026-02-24 01:38:42.275+02	2026-02-24 01:38:42.275+02
5	events	2026-02-24 01:38:42.275+02	2026-02-24 01:38:42.275+02
6	community notices	2026-02-24 01:38:42.275+02	2026-02-24 01:38:42.275+02
7	minutes	2026-02-25 19:27:46.322+02	2026-02-25 19:27:46.322+02
8	announcements	2026-02-25 19:27:46.322+02	2026-02-25 19:27:46.322+02
9	news updates	2026-02-25 19:27:46.322+02	2026-02-25 19:27:46.322+02
10	emergency alerts	2026-02-25 19:27:46.322+02	2026-02-25 19:27:46.322+02
11	events	2026-02-25 19:27:46.322+02	2026-02-25 19:27:46.322+02
12	community notices	2026-02-25 19:27:46.322+02	2026-02-25 19:27:46.322+02
13	minutes	2026-02-25 20:03:59.507+02	2026-02-25 20:03:59.507+02
14	announcements	2026-02-25 20:03:59.507+02	2026-02-25 20:03:59.507+02
15	news updates	2026-02-25 20:03:59.507+02	2026-02-25 20:03:59.507+02
16	emergency alerts	2026-02-25 20:03:59.507+02	2026-02-25 20:03:59.507+02
17	events	2026-02-25 20:03:59.507+02	2026-02-25 20:03:59.507+02
18	community notices	2026-02-25 20:03:59.507+02	2026-02-25 20:03:59.507+02
19	minutes	2026-02-25 20:16:41.924+02	2026-02-25 20:16:41.924+02
20	announcements	2026-02-25 20:16:41.924+02	2026-02-25 20:16:41.924+02
21	news updates	2026-02-25 20:16:41.924+02	2026-02-25 20:16:41.924+02
22	emergency alerts	2026-02-25 20:16:41.924+02	2026-02-25 20:16:41.924+02
23	events	2026-02-25 20:16:41.924+02	2026-02-25 20:16:41.924+02
24	community notices	2026-02-25 20:16:41.924+02	2026-02-25 20:16:41.924+02
\.


--
-- Data for Name: Clans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Clans" (id, name, "districtId", "createdAt", "updatedAt") FROM stdin;
36	Boe	4	2026-02-25 19:27:46.597+02	2026-02-25 19:27:46.597+02
37	Gosenter	4	2026-02-25 19:27:46.682+02	2026-02-25 19:27:46.682+02
38	Quella	4	2026-02-25 19:27:46.69+02	2026-02-25 19:27:46.69+02
39	Sarlay	4	2026-02-25 19:27:46.696+02	2026-02-25 19:27:46.696+02
40	Garr	5	2026-02-25 19:27:46.705+02	2026-02-25 19:27:46.705+02
41	Bain	5	2026-02-25 19:27:46.713+02	2026-02-25 19:27:46.713+02
42	Sanniquellie	6	2026-02-25 19:27:46.724+02	2026-02-25 19:27:46.724+02
43	Mahn	6	2026-02-25 19:27:46.73+02	2026-02-25 19:27:46.73+02
44	Doe	7	2026-02-25 19:27:46.737+02	2026-02-25 19:27:46.737+02
45	Gbehlay	8	2026-02-25 19:27:46.745+02	2026-02-25 19:27:46.745+02
\.


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comments" (id, "postID", "userID", comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Counties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Counties" (id, name, "createdAt", "updatedAt") FROM stdin;
5	Nimba	2026-02-25 19:27:46.573+02	2026-02-25 19:27:46.573+02
\.


--
-- Data for Name: Districts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Districts" (id, name, "countyId", "createdAt", "updatedAt") FROM stdin;
4	Boe & Quilla	5	2026-02-25 19:27:46.577+02	2026-02-25 19:27:46.577+02
5	Garr-Bain	5	2026-02-25 19:27:46.703+02	2026-02-25 19:27:46.703+02
6	Sanniquellie-Mahn	5	2026-02-25 19:27:46.722+02	2026-02-25 19:27:46.722+02
7	Doe	5	2026-02-25 19:27:46.736+02	2026-02-25 19:27:46.736+02
8	Gbehlay-Geh	5	2026-02-25 19:27:46.743+02	2026-02-25 19:27:46.743+02
\.


--
-- Data for Name: Documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documents" (id, "userID", category, title, description, image, "RecordedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FamilyMembers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FamilyMembers" (id, household_head_id, fullname, dob, gender, relationship, status, dod, marital_status, occupation, notes, county_id, district_id, clan_id, town_id, village_id, "createdAt", "updatedAt") FROM stdin;
1	6	Johnny Joe	2020-12-30 02:00:00+02	Male	Child	Alive	\N	\N	unemploy	\N	\N	\N	\N	\N	\N	2026-03-04 03:01:36.515+02	2026-03-04 03:01:36.515+02
2	17	patrick patrick	2000-01-01 02:00:00+02	Male	Child	Alive	\N	\N	employ	\N	\N	\N	\N	\N	\N	2026-03-04 13:17:44.278+02	2026-03-04 13:17:44.278+02
3	19	Mishael Jones	2005-12-15 02:00:00+02	Male	Child	Alive	\N	\N	Student	\N	6	10	52	198	\N	2026-03-10 01:39:31.815+02	2026-03-10 01:39:31.815+02
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notifications" (id, "userID", title, message, type, "isRead", "createdAt", "updatedAt") FROM stdin;
1	6	Account created for you	your account has been created successfull	account	f	2026-02-26 18:40:06.174+02	2026-02-26 18:40:06.174+02
2	7	Account created for you	your account has been created successfull	account	f	2026-03-02 20:55:16.456+02	2026-03-02 20:55:16.456+02
3	8	Account created for you	your account has been created successfull	account	f	2026-03-02 21:21:15.813+02	2026-03-02 21:21:15.813+02
4	9	Account created for you	your account has been created successfull	account	f	2026-03-02 21:27:25.495+02	2026-03-02 21:27:25.495+02
5	10	Account created for you	your account has been created successfull	account	f	2026-03-02 21:30:08.541+02	2026-03-02 21:30:08.541+02
7	16	Account created for you	your account has been created successfully	account	f	2026-03-04 12:54:02.037+02	2026-03-04 12:54:02.037+02
8	17	Account created for you	your account has been created successfully	account	f	2026-03-04 13:16:20.355+02	2026-03-04 13:16:20.355+02
9	18	Account created for you	your account has been created successfully	account	f	2026-03-04 13:28:23.251+02	2026-03-04 13:28:23.251+02
14	19	Request Approved	your request has been approved !	request	f	2026-03-10 04:12:50.273+02	2026-03-10 04:12:50.273+02
15	6	Request Rejected	your request has been rejected !	request	f	2026-03-10 04:13:12.18+02	2026-03-10 04:13:12.18+02
\.


--
-- Data for Name: Permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permissions" (id, name, description, "createdAt", "updatedAt") FROM stdin;
66	view_dashboard	View the dashboard page	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
67	view_statistics	View statistics and analytics	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
68	create_user	Create new users/leaders	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
69	manage_users	Edit or delete users	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
70	view_leaders	View list of leaders	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
71	view_citizens	View list of citizens	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
72	approve_request	Approve transfer/relocation requests	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
73	reject_request	Reject transfer/relocation requests	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
74	send_broadcast	Create and send broadcast posts	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
75	manage_post_type	Manage post categories/types	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
76	submit_request	Submit transfer/relocation requests	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
77	view_broadcasts	View broadcast posts	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
78	escalate_issue	Escalate issues to higher authority	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
79	manage_documents	Add, view, or delete documents	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
80	view_all_reports	View reports across the system	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
81	manage_regions	Manage counties, districts, towns, villages	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
82	suspend_users	Activate or deactivate user accounts	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
83	view_notifications	View notifications	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
84	manage_family	Manage household and family records	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
85	view_households	View household/family records in jurisdiction	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
86	create_report	Generate structured administrative reports	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
87	view_reports	View generated administrative reports	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
88	register_birth	Register a new birth in the household/village	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
89	mark_deceased	Record a death in the household/village	2026-03-04 01:56:32.489+02	2026-03-04 01:56:32.489+02
\.


--
-- Data for Name: Posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Posts" (id, "userID", "categoryID", title, description, image, status, county_id, district_id, clan_id, town_id, village_id, "createdAt", "updatedAt") FROM stdin;
1	8	2	announcement	klhlkhlhlk	\N	approved	5	6	\N	\N	\N	2026-03-04 13:24:44.53+02	2026-03-04 13:24:44.53+02
\.


--
-- Data for Name: Reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reports" (id, title, type, summary, "generatedBy", scope, data, county_id, district_id, clan_id, town_id, village_id, "createdAt", "updatedAt", status, "sentTo") FROM stdin;
1	Village Population Census 	Monthly Population Update		8	district	{"citizens": 0, "timestamp": "2026-03-03T23:59:17.372Z", "households": 0, "population": 0, "familyMembersTotal": 0}	5	6	\N	\N	\N	2026-03-04 01:59:17.374+02	2026-03-04 02:29:01.159+02	submitted	county_leader
2	ecurity	Incident Summary	security risk	8	district	{"kids": 0, "males": 0, "adults": 0, "females": 0, "citizens": 0, "employed": 0, "timestamp": "2026-03-04T11:23:04.595Z", "households": 0, "population": 0, "unemployed": 0, "localLeaders": 2, "deceasedRecorded": 0, "familyMembersTotal": 0}	5	6	\N	\N	\N	2026-03-04 13:23:04.595+02	2026-03-04 13:23:47.44+02	submitted	county_leader
\.


--
-- Data for Name: Requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Requests" (id, "userID", reason, status, county_id, district_id, clan_id, town_id, village_id, "createdAt", "updatedAt", full_name, national_id, phone_number, household_size, current_county_id, current_district_id, current_clan_id, current_town_id, current_village_id, transfer_type, move_date, transfer_duration, supporting_document, host_name, host_phone, host_relationship) FROM stdin;
2	6	Family Relocation and Safety	pending	6	10	52	198	33	2026-03-10 03:48:15.463+02	2026-03-10 03:48:15.463+02	John Doe	1020304050	0880708090	1	5	4	39	176	17	Family relocation	2026-02-11 02:00:00+02	Permanent	\N			
3	6	Family Relocation and Safety	pending	6	10	52	198	33	2026-03-10 03:51:44.811+02	2026-03-10 03:51:44.811+02	John Doe	1020304050	0880708090	1	5	4	39	176	17	Family relocation	2026-02-11 02:00:00+02	Permanent	\N			
4	19	Work Relocation	approved	5	5	40	178	18	2026-03-10 04:10:26.338+02	2026-03-10 04:12:50.265+02	Joe Jones	9868678757	0791701088	1	6	10	52	198	33	Employment	2026-03-15 02:00:00+02	Permanent	\N			
1	6	Family relocation and Family Safety	rejected	5	4	39	176	17	2026-03-10 03:25:41.874+02	2026-03-10 04:13:12.175+02	John Doe	1020304050	0880708090	1	6	9	49	195	29	Family relocation	2026-10-03 02:00:00+02	Permanent	\N			
\.


--
-- Data for Name: RolePermissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermissions" (id, role, "permissionId", "createdAt", "updatedAt") FROM stdin;
377	admin	66	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
378	admin	67	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
379	admin	68	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
380	admin	69	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
381	admin	70	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
382	admin	71	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
383	admin	72	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
384	admin	73	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
385	admin	74	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
386	admin	75	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
387	admin	77	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
388	admin	79	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
389	admin	80	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
390	admin	81	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
391	admin	82	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
392	admin	83	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
393	admin	85	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
394	admin	86	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
395	admin	87	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
396	admin	84	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
397	admin	88	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
398	admin	89	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
399	village_leader	66	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
400	village_leader	67	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
401	village_leader	68	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
402	village_leader	71	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
403	village_leader	72	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
404	village_leader	73	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
405	village_leader	74	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
406	village_leader	77	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
407	village_leader	79	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
408	village_leader	83	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
409	village_leader	85	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
410	village_leader	86	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
411	village_leader	87	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
412	village_leader	88	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
413	village_leader	89	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
414	citizen	66	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
415	citizen	67	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
416	citizen	76	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
417	citizen	77	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
418	citizen	79	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
419	citizen	83	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
420	citizen	84	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
421	citizen	88	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
422	citizen	89	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20231201082741-create-user.js
20231201082742-create-Requests.js
20231201082742-create-documents.js
20231208145628-create-categories.js
20231208145628-create-post.js
20231208145629-create-notifications.js
20231208145629-create-province.js
z20231208145629-create-district.js
20260224000000-localize-to-liberia.js
20260227223000-rename-reson-to-reason-in-requests.js
zz20231208145629-create-Sectors.js
zzzz20231208145629-create-Cells.js
zzzzzz20231208145629-create-Villages.js
zzzzzz20231208145639-create-comment.js
20260303210000-create-permissions.js
20260303210001-create-role-permissions.js
zzzzzzz20260224000000-localize-to-liberia.js
20260303220000-create-family-members.js
20260303220001-create-reports.js
20260304000001-add-report-status-columns.js
20260310080000-add-isVerified-to-users.js
20260310000000-enhance-requests-table.js
\.


--
-- Data for Name: Towns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Towns" (id, name, "clanId", "createdAt", "updatedAt") FROM stdin;
162	Saclepea	36	2026-02-25 19:27:46.655+02	2026-02-25 19:27:46.655+02
163	Ganta	36	2026-02-25 19:27:46.66+02	2026-02-25 19:27:46.66+02
164	Ba Town	36	2026-02-25 19:27:46.662+02	2026-02-25 19:27:46.662+02
165	Bade Station	36	2026-02-25 19:27:46.665+02	2026-02-25 19:27:46.665+02
166	Bali	36	2026-02-25 19:27:46.667+02	2026-02-25 19:27:46.667+02
167	Bala	36	2026-02-25 19:27:46.67+02	2026-02-25 19:27:46.67+02
168	Bango	36	2026-02-25 19:27:46.672+02	2026-02-25 19:27:46.672+02
169	Baple	36	2026-02-25 19:27:46.675+02	2026-02-25 19:27:46.675+02
170	Batao	36	2026-02-25 19:27:46.678+02	2026-02-25 19:27:46.678+02
171	Bayatluo	36	2026-02-25 19:27:46.68+02	2026-02-25 19:27:46.68+02
172	Gosenter Town	37	2026-02-25 19:27:46.685+02	2026-02-25 19:27:46.685+02
173	Kialee Village	37	2026-02-25 19:27:46.687+02	2026-02-25 19:27:46.687+02
174	Quella Town	38	2026-02-25 19:27:46.692+02	2026-02-25 19:27:46.692+02
175	Zou Village	38	2026-02-25 19:27:46.694+02	2026-02-25 19:27:46.694+02
176	Sarlay Town	39	2026-02-25 19:27:46.699+02	2026-02-25 19:27:46.699+02
177	Vahn Village	39	2026-02-25 19:27:46.701+02	2026-02-25 19:27:46.701+02
178	Gahngpua Town	40	2026-02-25 19:27:46.707+02	2026-02-25 19:27:46.707+02
179	Gbenie Town	40	2026-02-25 19:27:46.709+02	2026-02-25 19:27:46.709+02
180	Kpatuo Town	40	2026-02-25 19:27:46.711+02	2026-02-25 19:27:46.711+02
181	Kpowin Town	41	2026-02-25 19:27:46.716+02	2026-02-25 19:27:46.716+02
182	Meletuo Town	41	2026-02-25 19:27:46.718+02	2026-02-25 19:27:46.718+02
183	Yekepa City	41	2026-02-25 19:27:46.72+02	2026-02-25 19:27:46.72+02
184	Sanniquellie City	42	2026-02-25 19:27:46.727+02	2026-02-25 19:27:46.727+02
185	Geipa Town	42	2026-02-25 19:27:46.729+02	2026-02-25 19:27:46.729+02
186	Yolowee Town	43	2026-02-25 19:27:46.732+02	2026-02-25 19:27:46.732+02
187	Gorguo Town	43	2026-02-25 19:27:46.734+02	2026-02-25 19:27:46.734+02
188	Tiayee Town	44	2026-02-25 19:27:46.739+02	2026-02-25 19:27:46.739+02
189	Zorgowee Town	44	2026-02-25 19:27:46.741+02	2026-02-25 19:27:46.741+02
190	Loguatuo Town	45	2026-02-25 19:27:46.747+02	2026-02-25 19:27:46.747+02
191	Karnplay City	45	2026-02-25 19:27:46.748+02	2026-02-25 19:27:46.748+02
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, firstname, lastname, email, password, phone, gender, code, status, image, role, county_id, nid, familyinfo, district_id, clan_id, town_id, village_id, "createdAt", "updatedAt", "isVerified") FROM stdin;
5	Jacob	Logan	jac@gmail.com	$2a$10$AmhM6tt6BicXRoGzHRjJYusGjZntImsyQpKjg.BUwswtx0hpJTmFi	0791701099	Male	\N	active	\N	admin	\N	\N	\N	\N	\N	\N	\N	2026-02-25 20:16:41.903+02	2026-02-25 20:16:41.903+02	t
6	John	Doe	john@gmail.com	$2a$10$C.sikTPUcALZ8uBHWLat/..CjSabACDgRz4fPb.H/GIQU3Tj8ELf6	0880708090	Male	\N	active	\N	citizen	\N	1020304050	\N	\N	\N	\N	\N	2026-02-26 18:40:02.912+02	2026-02-26 18:40:02.912+02	t
17	Denyse	Denyse	denyse@gmail.com	$2a$10$.FOBDVmcxBlbjO/QSFH1H.dAtQNoQi2ropNJVotjYNjneOJhzfh6K	0880654321	Female	\N	active	\N	citizen	\N	1341431341	\N	\N	\N	\N	\N	2026-03-04 13:14:53.478+02	2026-03-04 13:14:53.478+02	t
7	Rena	Joe	rena@gmail.com	$2a$10$qjzdSVlIstO7Kqfslj.qven66rC.m57jbgEJbLXy.IxhZhxDJsLxe	0880233212	Female	\N	active	\N	citizen	\N	9876543210	\N	\N	\N	\N	\N	2026-03-02 20:55:12.96+02	2026-03-02 20:55:12.96+02	t
16	Mark	Mark	mark@gmail.com	$2a$10$jWzpwoMJD/Po6gUYFFXNUOwT5wzpdqmJ5yeT3TaomCBk/cUE0G3sa	0770847565	Male	\N	active	\N	village_leader	5	6546535236	\N	4	39	176	17	2026-03-04 12:53:58.956+02	2026-03-04 12:53:58.956+02	t
19	Joe	Jones	j2beesr2bees@gmail.com	$2a$10$OGpaMjcAj41LFvB9M1DmFOEIDLlHitK12syc73tNT5cXqJCnlP5oK	0791701088	Male	\N	active	\N	citizen	5	9868678757		5	40	178	18	2026-03-10 00:02:57.473+02	2026-03-10 04:12:50.257+02	t
21	Patrick	Patrick 	denysegakiza@gmail.com	$2a$10$f9yLcIFidUvXZtB7R.7Aq.vE6mQui.z2CUiMu706uE/L3h9XnHNlW	0880376453	Male	\N	active	\N	citizen	5	2748973847		4	39	176	17	2026-03-17 14:24:04.198+02	2026-03-17 14:24:04.198+02	f
20	Rose	Rose	darkjac201@gmail.com	$2a$10$FNlmrBi4WHsG05S23KTKXu0awGL7WH2eBu3c1vpo/M4fLu3Ub8Bpy	0880300885	Male	\N	active	\N	citizen	\N	9348758947		\N	\N	\N	\N	2026-03-10 00:40:59.31+02	2026-03-10 00:40:59.31+02	f
18	ituitit	yoiyioy	county@gmail.com	$2a$10$h9.e0klcfxeVG0.KMKq5DOQh46GYgM.CIfEl0e6u4ho.lI0oDxlEa	895878858	Male	\N	active	\N	citizen	5	6898897909	\N	\N	\N	\N	\N	2026-03-04 13:27:52.696+02	2026-03-04 13:27:52.696+02	f
8	Joe	Joe	joe@gmail.com	$2a$10$KCHVXeMMd35woqDgpxQkd.X2/88VxKIO7rvx5dX8iRs5gG/3cdJZ6	0880124567	Male	\N	active	\N	citizen	5	5432123345	\N	6	\N	\N	\N	2026-03-02 21:21:12.113+02	2026-03-02 21:21:12.113+02	t
9	Ruth	Ruth	ruth@gmail.com	$2a$10$kjkPwCjnYhr1H2CWVEfM1e62vUu7Cy5ImhWp7zOi2Uc2EWu/4NYg.	0770893654	Female	\N	active	\N	citizen	5	7898767678	\N	6	42	\N	\N	2026-03-02 21:27:22.398+02	2026-03-02 21:27:22.398+02	t
10	Robert	Robert	robert@gmail.com	$2a$10$Fs3hY1Odyp3oabCXsQFHzOGNhIVnlpWFqFFjeo0WXdjFEVNd/03da	0770354231	Male	\N	active	\N	citizen	\N	3456776543	\N	\N	\N	\N	\N	2026-03-02 21:30:05.601+02	2026-03-02 21:30:05.601+02	t
\.


--
-- Data for Name: Villages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Villages" (id, name, "townId", "createdAt", "updatedAt") FROM stdin;
1	Saclepea Central	162	2026-03-04 12:28:55.284+02	2026-03-04 12:28:55.284+02
2	Saclepea North	162	2026-03-04 12:28:55.324+02	2026-03-04 12:28:55.324+02
3	Ganta City Village	163	2026-03-04 12:28:55.328+02	2026-03-04 12:28:55.328+02
4	Ganta Outskirts	163	2026-03-04 12:28:55.33+02	2026-03-04 12:28:55.33+02
5	Ba Town 1	164	2026-03-04 12:28:55.335+02	2026-03-04 12:28:55.335+02
6	Ba Town 2	164	2026-03-04 12:28:55.337+02	2026-03-04 12:28:55.337+02
7	Bade Village 1	165	2026-03-04 12:28:55.34+02	2026-03-04 12:28:55.34+02
8	Bade Village 2	165	2026-03-04 12:28:55.343+02	2026-03-04 12:28:55.343+02
9	Bali Village	166	2026-03-04 12:28:55.346+02	2026-03-04 12:28:55.346+02
10	Bala Village	167	2026-03-04 12:28:55.35+02	2026-03-04 12:28:55.35+02
11	Bango Village	168	2026-03-04 12:28:55.354+02	2026-03-04 12:28:55.354+02
12	Baple Village	169	2026-03-04 12:28:55.357+02	2026-03-04 12:28:55.357+02
13	Batao Village	170	2026-03-04 12:28:55.36+02	2026-03-04 12:28:55.36+02
14	Bayatluo Village	171	2026-03-04 12:28:55.363+02	2026-03-04 12:28:55.363+02
15	Gosenter Village 1	172	2026-03-04 12:28:55.367+02	2026-03-04 12:28:55.367+02
16	Quella Village	174	2026-03-04 12:28:55.371+02	2026-03-04 12:28:55.371+02
17	Sarlay Village	176	2026-03-04 12:28:55.375+02	2026-03-04 12:28:55.375+02
18	Gahngpua Village	178	2026-03-04 12:28:55.38+02	2026-03-04 12:28:55.38+02
19	Gbenie Village	179	2026-03-04 12:28:55.383+02	2026-03-04 12:28:55.383+02
20	Kpatuo Village	180	2026-03-04 12:28:55.386+02	2026-03-04 12:28:55.386+02
21	Kpowin Village	181	2026-03-04 12:28:55.39+02	2026-03-04 12:28:55.39+02
22	Meletuo Village	182	2026-03-04 12:28:55.393+02	2026-03-04 12:28:55.393+02
23	Yekepa Area A	183	2026-03-04 12:28:55.396+02	2026-03-04 12:28:55.396+02
24	Yekepa Area B	183	2026-03-04 12:28:55.398+02	2026-03-04 12:28:55.398+02
36	Sophea	184	2026-03-21 13:47:10.781+02	2026-03-21 13:47:10.781+02
\.


--
-- Name: Categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Categories_id_seq"', 24, true);


--
-- Name: Cells_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cells_id_seq"', 207, true);


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 1, false);


--
-- Name: Districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Districts_id_seq"', 13, true);


--
-- Name: Documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Documents_id_seq"', 1, false);


--
-- Name: FamilyMembers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FamilyMembers_id_seq"', 3, true);


--
-- Name: Notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notifications_id_seq"', 15, true);


--
-- Name: Permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Permissions_id_seq"', 89, true);


--
-- Name: Posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Posts_id_seq"', 1, true);


--
-- Name: Provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Provinces_id_seq"', 6, true);


--
-- Name: Reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reports_id_seq"', 2, true);


--
-- Name: Requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Requests_id_seq"', 4, true);


--
-- Name: RolePermissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RolePermissions_id_seq"', 422, true);


--
-- Name: Sectors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Sectors_id_seq"', 59, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 21, true);


--
-- Name: Villages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Villages_id_seq"', 36, true);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Towns Cells_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Towns"
    ADD CONSTRAINT "Cells_pkey" PRIMARY KEY (id);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: Districts Districts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Districts"
    ADD CONSTRAINT "Districts_pkey" PRIMARY KEY (id);


--
-- Name: Documents Documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_pkey" PRIMARY KEY (id);


--
-- Name: FamilyMembers FamilyMembers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FamilyMembers"
    ADD CONSTRAINT "FamilyMembers_pkey" PRIMARY KEY (id);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: Permissions Permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_name_key" UNIQUE (name);


--
-- Name: Permissions Permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY (id);


--
-- Name: Posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- Name: Counties Provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Counties"
    ADD CONSTRAINT "Provinces_pkey" PRIMARY KEY (id);


--
-- Name: Reports Reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);


--
-- Name: Requests Requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Requests"
    ADD CONSTRAINT "Requests_pkey" PRIMARY KEY (id);


--
-- Name: RolePermissions RolePermissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermissions"
    ADD CONSTRAINT "RolePermissions_pkey" PRIMARY KEY (id);


--
-- Name: Clans Sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clans"
    ADD CONSTRAINT "Sectors_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_phone_key" UNIQUE (phone);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Villages Villages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Villages"
    ADD CONSTRAINT "Villages_pkey" PRIMARY KEY (id);


--
-- Name: RolePermissions unique_role_permission; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermissions"
    ADD CONSTRAINT unique_role_permission UNIQUE (role, "permissionId");


--
-- Name: Towns Cells_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Towns"
    ADD CONSTRAINT "Cells_sectorId_fkey" FOREIGN KEY ("clanId") REFERENCES public."Clans"(id);


--
-- Name: Comments Comments_postID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_postID_fkey" FOREIGN KEY ("postID") REFERENCES public."Posts"(id) ON DELETE CASCADE;


--
-- Name: Comments Comments_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Districts Districts_provinceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Districts"
    ADD CONSTRAINT "Districts_provinceId_fkey" FOREIGN KEY ("countyId") REFERENCES public."Counties"(id);


--
-- Name: Documents Documents_RecordedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_RecordedBy_fkey" FOREIGN KEY ("RecordedBy") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Documents Documents_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: FamilyMembers FamilyMembers_household_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FamilyMembers"
    ADD CONSTRAINT "FamilyMembers_household_head_id_fkey" FOREIGN KEY (household_head_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Posts Posts_categoryID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES public."Categories"(id) ON DELETE CASCADE;


--
-- Name: Posts Posts_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Reports Reports_generatedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Requests Requests_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Requests"
    ADD CONSTRAINT "Requests_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: RolePermissions RolePermissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermissions"
    ADD CONSTRAINT "RolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permissions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Clans Sectors_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clans"
    ADD CONSTRAINT "Sectors_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."Districts"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict WW2fj26U1tWaI3Q7QwTqVMGiZP1HxIeV0pfgV6kRwAJ7BvggfITVFaTGk9gzvqN

