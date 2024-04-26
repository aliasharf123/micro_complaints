-- Add down migration script here
DELETE TYPE status
DROP TABLE IF EXISTS `complaint`;
