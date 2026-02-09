-- Migration to add subject column to cx_contact_messages
alter table cx_contact_messages add column subject text;
