--users table (created for Clerk authentication):
--================================================
id VARCHAR(255) PRIMARY KEY,  -- Clerk useId
email VARCHAR(255) UNIQUE NOT NULL,
first_name VARCHAR(100),
last_name VARCHAR(100),
has_completed_form BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

--application_form table:
--===================
id SERIAL PRIMARY KEY,
user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,

-- personal details section
firstnames VARCHAR(255) NOT NULL,
surname VARCHAR(255) NOT NULL,
gender VARCHAR(50) NOT NULL,
birthdate DATE NOT NULL,
said CHAR(13) NOT NULL UNIQUE,
south_african_citizen TEXT NOT NULL CHECK(south_african_citizen IN ('Yes','No'))
race TEXT NOT NULL CHECK (race IN ('African', 'Coloured', 'Indian', 'White', 'Other')),

-- contact & address section
email TEXT NOT NULL, -- automatically populated from users.email
contactnumber CHAR(10) NOT NULL CHECK(contact_number ~ '^0[0-9]{9}$'),
secondarycontact CHAR(10) CHECK(secondarycontact ~ '^0[0-9]{9}$'),
facebookurl TEXT,
current_street TEXT NOT NULL CHECK (length(address) > 1),
current_suburb TEXT NOT NULL (length(address) > 1),
current_city VARCHAR(100) NOT NULL (length(address) > 1),
current_postcode CHAR(4)  NOT NULL CHECK(postcode ~ '^[0-9]{4}$'),

-- education & qualifications section
sa_languages_spoken JSONB NOT NULL DEFAULT '[]'::jsonb,
foreign_languages_spoken JSONB DEFAULT '[]'::jsonb,
name_of_matriculated_school TEXT NOT NULL,
highest_grade VARCHAR(50) NOT NULL, --selected on the form from a drop-down list
high_school_results JSONB NOT NULL DEFAULT '{}' CHECK (cardinality(array(SELECT jsonb_object_keys(high_school_results))) > 7),

-- Tertiary section
tertiary_institution TEXT,
field_of_study VARCHAR(255),
year_completed INTEGER NOT NULL CHECK (year_completed BETWEEN 1950 AND EXTRACT(YEAR FROM CURRENT_DATE) + 1),
qualification_type VARCHAR(255),
specialization VARCHAR(255),
subject_passed_with_grades JSONB DEFAULT '[]'::jsonb,
achievements TEXT,
degree_name VARCHAR(255),
career_objectives TEXT,
expected_graduation_year INTEGER NOT NULL CHECK (year_completed BETWEEN 2026 AND EXTRACT(YEAR FROM CURRENT_DATE) + 10),

-- skills & interest section
skills JSONB NOT NULL DEFAULT '[]'::jsonb,
hobbies JSONB DEFAULT '[]'::jsonb,
sports JSONB DEFAULT '[]'::jsonb,
drivers_license SONB NOT NULL DEFAULT '[]'::jsonb,
own_vehicle BOOLEAN NOT NULL,
vehicle_type VARCHAR(255),

-- Experience section
tax_number CHAR(10) UNIQUE CHECK (tax_number ~ '[0-9]{10}$'),
previous_job_type TEXT,
previous_job_1_company_name TEXT,
previous_job_1_start_date DATE,
previous_job_1_end_date DATE,
previous_job_1_salary NUMERIC(12,2),
previous_job_1_reference_name TEXT,
previous_job_1_reference_role TEXT,
previous_job_1_reference_contact TEXT CHECK (previous_job_1_reference_contact ~ '^0[0-9]{9}$'),
CONSTRAINT check_dates_1 CHECK (previous_job_1_end_date IS NULL OR previous_job_1_end_date > previous_job_1_start_date),

previous_job_2_company_name TEXT,
previous_job_2_start_date DATE,
previous_job_2_end_date DATE,
previous_job_2_salary NUMERIC(12,2),
previous_job_2_reference_name TEXT,
previous_job_2_reference_role TEXT,
previous_job_2_reference_contact TEXT CHECK (previous_job_2_reference_contact ~ '^0[0-9]{9}$'),
CONSTRAINT check_dates_2 CHECK (previous_job_2_end_date IS NULL OR previous_job_2_end_date > previous_job_2_start_date),

previous_job_3_company_name TEXT,
previous_job_3_start_date DATE,
previous_job_3_end_date DATE,
previous_job_3_salary NUMERIC(12,2),
previous_job_3_reference_name TEXT,
previous_job_3_reference_role TEXT,
previous_job_3_reference_contact TEXT CHECK (previous_job_3_reference_contact ~ '^0[0-9]{9}$'),
CONSTRAINT check_dates_3 CHECK (previous_job_3_end_date IS NULL OR previous_job_3_end_date > previous_job_3_start_date)

-- availability & how heard section
availability TEXT DEFAULT 'NOT AVAILABLE' CHECK(availability IN ('NOT AVAILABLE', 'SUNDAYS ONLY', 'SATURDAYS ONLY', 'ALL DAYS', 'WEEKENDS', 'MONDAYS ONLY')),
referral_source VARCHAR(100) NOT NULL,
office_application BOOLEAN NOT NULL DEFAULT FALSE,

-- interview booking section (preferably saved inside an employee portal for later edits)
interview_date DATE,
interview_time TIME;

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


-- Stocktake Training table
--====================
no SERIAL PRIMARY KEY,
said CHAR(13) NOT NULL, --references applicant.said
date_paid_for_training DATE NOT NULL,
training_date DATE,
training_receipt_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM date_paid_for_training),
training_receipt_number VARCHAR(20) NOT NULL,
CONSTRAINT unique_receipt_per_year UNIQUE(training_receipt_year, training_receipt_number)
counter_test_score INTEGER CHECK(counter_test_score BETWEEN 0 AND 100)
comments TEXT,
student_number INTEGER UNIQUE,---automatically generated from the last registered stocktaker's student number
received_card_cert BOOLEAN DEFAULT FALSE,


-- stocktake_items table
--================
id SERIAL PRIMARY KEY,
category TEXT CHECK(category IN ('Apparel', 'Stationary','Accessory')),
item_name TEXT CHECL((item_name IN('Lanyard','Student Card','Certificates','Grey T-shirt', 'Yellow T-shirt','Beanie-Orange','Beanie-Blue','Stocktake Manual','Pouch','Pen')),
item_SIZE CHECK(item_size IN('S','M','L','XL','XXL','N/A')) DEFAULT 'N/A',
current_stock INTEGER DEFAULT 0
replenishment_qty INTEGER DEFAULT 0 CHECK (replenishment_qty >= 0),
replenishment_qty TIMESTAMP DEFAULT CURRENT TIMESTAMP,
-- Ensures unique entry for each T-shirt size (e.g., only one 'Grey T-shirt' in 'L')
CONSTRAINT unique_item_size UNIQUE (item_name, item_size)

---stock_issuances
--=================
id SERIAL PRIMARY KEY,
staff_name TEXT NOT NULL DEFAULT 'KATLEGO MOTSEPE',
receipt_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
receipt_number INTEGER NOT NULL,
issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--Composite unique ensures Receipt #1 for 2026 is unique
CONSTRAINT unique_receipt_year UNIQUE (receipt_year, receipt_number)


--issuance_items
--===============
id SERIAL PRIMARY KEY,
issuance_id INTEGER REFERENCES stock_issuances(id),
product_id INTEGER REFERENCES stocktake_items(id),
quantity INTEGER NOT NULL CHECK (quantity > 0)

--event_category Enum
--===================
Registration
Counter Training
Scanner Training
Back Area Training
Meeting
Interview
Workshop

---events table
--===============
id SERIAL PRIMARY KEY,
event_type envent_category NOT NULL,
event_title TEXT NOT NULL,
start_time TIMESTAMP NOT NULL,
end_time TIMESTAMP NOT NULL,
max_attendees INTEGER NOT NULL CHECK(max_attendees > 0),
current_bookings INTEGER DEFAULT 0,
location TEXT DEFAULT '62 Juta Street Braamfontein floor 5',
CONSTRAINT future_event_check CHECK (start_time > CURRENT_TIMESTAMP)


--event_registrations table (used by admin to create events)
--==========================
id SERIAL PRIMARY KEY,
event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
applicant_id INTEGER REFERENCES job_applications(id),
registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- Prevent the same person from registering for the same event twice
UNIQUE (event_id, applicant_id)

