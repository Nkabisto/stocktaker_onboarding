-- Add columns for personal details (Step 1)
ALTER TABLE form_submissions
ADD COLUMN firstnames VARCHAR(255),
ADD COLUMN surname VARCHAR(255),
ADD COLUMN gender VARCHAR(50),
ADD COLUMN birthdate DATE,
ADD COLUMN said VARCHAR(13),
ADD COLUMN south_african_citizen VARCHAR(10),   -- Yes/No
ADD COLUMN race VARCHAR(100);

-- Add columns for contact & address (Step 2)
ALTER TABLE form_submissions
ADD COLUMN email VARCHAR(255),
ADD COLUMN contactnumber VARCHAR(20),
ADD COLUMN secondarycontact VARCHAR(20),
ADD COLUMN facebookurl VARCHAR(255),
ADD COLUMN address TEXT,
ADD COLUMN suburb VARCHAR(100),
ADD COLUMN city VARCHAR(100),
ADD COLUMN postcode VARCHAR(10);

-- Add columns for education & qualifications (Step 3)
ALTER TABLE form_submissions
ADD COLUMN highest_grade VARCHAR(50),
ADD COLUMN tertiary_institution VARCHAR(255),
ADD COLUMN field_of_study VARCHAR(255),
ADD COLUMN year_completed INTEGER;   -- can also be VARCHAR(4)

-- Add columns for skills & interests (Step 4)
ALTER TABLE form_submissions
ADD COLUMN skills_interest VARCHAR(255),
ADD COLUMN drivers_license VARCHAR(50),
ADD COLUMN other_skills TEXT;

-- Add columns for availability & how heard (Step 5)
ALTER TABLE form_submissions
ADD COLUMN availability VARCHAR(50),
ADD COLUMN how_heard VARCHAR(100),
ADD COLUMN other_how_heard VARCHAR(255),
ADD COLUMN training_fee_aware VARCHAR(10),
ADD COLUMN transport_aware VARCHAR(10);

-- Add columns for interview booking (Step 6)
ALTER TABLE form_submissions
ADD COLUMN interview_date DATE,
ADD COLUMN interview_time TIME;