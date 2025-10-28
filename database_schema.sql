-- WeCodeZW Database Schema
-- MySQL Database Creation Script

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS wecode_zw;
-- USE wecode_zw;

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS `MagicLink`;
DROP TABLE IF EXISTS `QuoteItem`;
DROP TABLE IF EXISTS `Quote`;
DROP TABLE IF EXISTS `Club`;
DROP TABLE IF EXISTS `Payment`;
DROP TABLE IF EXISTS `Invoice`;
DROP TABLE IF EXISTS `Subscription`;
DROP TABLE IF EXISTS `Request`;
DROP TABLE IF EXISTS `School`;
DROP TABLE IF EXISTS `User`;

-- Create User table
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('INDIVIDUAL', 'STUDENT', 'CORPORATE', 'ADMIN') NOT NULL DEFAULT 'INDIVIDUAL',
  `hashedPassword` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create School table
CREATE TABLE `School` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `contactEmail` VARCHAR(191) NOT NULL,
  `contactName` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `ownerId` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  INDEX `School_ownerId_fkey` (`ownerId`),
  FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Request table
CREATE TABLE `Request` (
  `id` VARCHAR(191) NOT NULL,
  `category` ENUM('TRAINING', 'WORKSHOP', 'SCHOOL_CLUB', 'SERVICES') NOT NULL,
  `description` VARCHAR(191) NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SCHEDULED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
  `scheduledAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Request_userId_fkey` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Invoice table
CREATE TABLE `Invoice` (
  `id` VARCHAR(191) NOT NULL,
  `number` VARCHAR(191) NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
  `amountUsd` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'DRAFT',
  `dueDate` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  `requestId` VARCHAR(191) NULL,
  `schoolId` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Invoice_number_key` (`number`),
  INDEX `Invoice_userId_fkey` (`userId`),
  INDEX `Invoice_requestId_fkey` (`requestId`),
  INDEX `Invoice_schoolId_fkey` (`schoolId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`requestId`) REFERENCES `Request`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Payment table
CREATE TABLE `Payment` (
  `id` VARCHAR(191) NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
  `amountUsd` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
  `method` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `invoiceId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Payment_invoiceId_fkey` (`invoiceId`),
  FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Subscription table
CREATE TABLE `Subscription` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `interval` ENUM('MONTHLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
  `nextRenewalDate` DATETIME(3) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Subscription_userId_fkey` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Club table
CREATE TABLE `Club` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `level` VARCHAR(191) NOT NULL,
  `planId` VARCHAR(191) NOT NULL,
  `students` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED') NOT NULL DEFAULT 'DRAFT',
  `schoolId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Club_schoolId_fkey` (`schoolId`),
  FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Quote table
CREATE TABLE `Quote` (
  `id` VARCHAR(191) NOT NULL,
  `number` VARCHAR(191) NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
  `totalUsd` DECIMAL(10, 2) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `data` JSON NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `schoolId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Quote_number_key` (`number`),
  INDEX `Quote_userId_fkey` (`userId`),
  INDEX `Quote_schoolId_fkey` (`schoolId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create QuoteItem table
CREATE TABLE `QuoteItem` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `unitUsd` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL,
  `lineUsd` DECIMAL(10, 2) NOT NULL,
  `quoteId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `QuoteItem_quoteId_fkey` (`quoteId`),
  FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create MagicLink table
CREATE TABLE `MagicLink` (
  `id` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `usedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `MagicLink_token_key` (`token`),
  INDEX `MagicLink_userId_fkey` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO `User` (`id`, `email`, `name`, `role`, `hashedPassword`, `phone`, `createdAt`, `updatedAt`) VALUES
('admin_user_id', 'admin@wecode.co.zw', 'Admin User', 'ADMIN', '$2a$10$GYMMH9RqxZYaB4Go9tNPX.vaUe.CFUbysiM6Axn9yhfbQjrbY3D4G', '+263 778 456 168', NOW(), NOW()),
('school_user_id', 'school@example.com', 'School Administrator', 'INDIVIDUAL', '$2a$10$GYMMH9RqxZYaB4Go9tNPX.vaUe.CFUbysiM6Axn9yhfbQjrbY3D4G', '+263 123 456 789', NOW(), NOW());

INSERT INTO `School` (`id`, `name`, `contactEmail`, `contactName`, `phone`, `createdAt`, `ownerId`) VALUES
('school_id', 'Sample School', 'school@example.com', 'School Administrator', '+263 123 456 789', NOW(), 'school_user_id');

-- Show tables created
SHOW TABLES;
