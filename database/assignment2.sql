--1. Data for table 'account'
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starknet.com',
        'Iam1ronM@n'
    );
--2. Modify account_type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--3. Delete Tony Stark record from database 
DELETE FROM public.account
WHERE account_id = 1;
--- 4. Update inventory 
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--5.  using inner join
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'sport';
--6. update all records in inventory 
UPDATE public.inventory
SET inv_image = REPLACE(
        inv_image,
        '/images/',
        '/images/vehicles/'
    ),
    inv_thumbnail = REPLACE(
        inv_image,
        '/images/',
        '/images/vehicles/'
    );