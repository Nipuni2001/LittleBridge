-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 23, 2026 at 10:13 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `littlebridge_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `action_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  KEY `idx_activity_logs_date` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `admin_id`, `action_type`, `entity_type`, `entity_id`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, NULL, 'USER_REGISTRATION', NULL, NULL, 'New user registered', '::ffff:127.0.0.1', NULL, '2026-03-13 04:22:49'),
(2, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-03-13 04:23:12'),
(3, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-03-13 04:26:32'),
(4, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-04 06:00:06'),
(5, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-04 06:00:20'),
(6, 2, NULL, 'USER_REGISTRATION', NULL, NULL, 'New user registered', '::ffff:127.0.0.1', NULL, '2026-04-04 06:03:05'),
(7, 5, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 1, 'User created sponsorship', NULL, NULL, '2026-04-04 09:53:16'),
(8, 2, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-04 09:59:26'),
(9, 2, NULL, 'ADOPTION_INITIATED', 'adoption_application', 1, 'User initiated adoption application', NULL, NULL, '2026-04-04 10:00:12'),
(10, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-04 10:18:03'),
(11, 1, NULL, 'ADOPTION_INITIATED', 'adoption_application', 2, 'User initiated adoption application', NULL, NULL, '2026-04-04 10:18:52'),
(12, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-04 16:25:30'),
(13, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-04 16:43:23'),
(14, 12, NULL, 'USER_REGISTRATION', NULL, NULL, 'New user registered', '::ffff:127.0.0.1', NULL, '2026-04-04 16:45:39'),
(15, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-05 17:40:57'),
(16, 14, NULL, 'USER_REGISTRATION', NULL, NULL, 'New both registered', '::ffff:127.0.0.1', NULL, '2026-04-05 17:48:08'),
(17, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-05 17:48:51'),
(18, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-05 20:17:13'),
(19, 1, NULL, 'ADOPTION_INITIATED', 'adoption_application', 3, 'User initiated adoption application', NULL, NULL, '2026-04-05 20:20:03'),
(20, 15, NULL, 'USER_REGISTRATION', NULL, NULL, 'New both registered', '::ffff:127.0.0.1', NULL, '2026-04-05 20:32:22'),
(21, 15, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 2, 'User created sponsorship', NULL, NULL, '2026-04-05 20:35:50'),
(22, 15, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 3, 'User created sponsorship', NULL, NULL, '2026-04-05 20:37:11'),
(23, 17, NULL, 'USER_REGISTRATION', NULL, NULL, 'New adopter registered', '::ffff:127.0.0.1', NULL, '2026-04-05 20:55:29'),
(24, 15, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-05 20:59:05'),
(25, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-05 20:59:17'),
(26, 19, NULL, 'USER_REGISTRATION', NULL, NULL, 'New adopter registered', '::ffff:127.0.0.1', NULL, '2026-04-06 04:50:25'),
(27, 19, NULL, 'ADOPTION_INITIATED', 'adoption_application', 4, 'User initiated adoption application', NULL, NULL, '2026-04-06 04:51:51'),
(28, 20, NULL, 'USER_REGISTRATION', NULL, NULL, 'New sponsor registered', '::ffff:127.0.0.1', NULL, '2026-04-06 04:58:32'),
(29, 20, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 4, 'User created sponsorship', NULL, NULL, '2026-04-06 05:00:03'),
(30, 22, NULL, 'USER_REGISTRATION', NULL, NULL, 'New adopter registered', '::ffff:127.0.0.1', NULL, '2026-04-06 05:05:13'),
(31, 22, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-06 05:07:35'),
(32, 22, NULL, 'ADOPTION_INITIATED', 'adoption_application', 5, 'User initiated adoption application', NULL, NULL, '2026-04-06 05:08:00'),
(33, 22, NULL, 'ADOPTION_INITIATED', 'adoption_application', 6, 'User initiated adoption application', NULL, NULL, '2026-04-06 05:10:58'),
(34, 15, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-06 05:13:32'),
(35, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-06 05:17:05'),
(36, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-06 05:18:58'),
(37, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-06 09:16:53'),
(38, 24, NULL, 'USER_REGISTRATION', NULL, NULL, 'New both registered', '::ffff:127.0.0.1', NULL, '2026-04-08 19:17:23'),
(39, 24, NULL, 'ADOPTION_INITIATED', 'adoption_application', 7, 'User initiated adoption application', NULL, NULL, '2026-04-08 19:20:44'),
(40, 22, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-08 19:26:08'),
(41, 19, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-08 19:28:16'),
(42, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-08 19:28:55'),
(43, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-08 19:44:31'),
(44, 27, NULL, 'USER_REGISTRATION', NULL, NULL, 'New both registered', '::ffff:127.0.0.1', NULL, '2026-04-10 16:35:07'),
(45, 15, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-10 16:36:29'),
(46, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-10 16:53:02'),
(47, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-11 20:06:15'),
(48, 29, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-11 20:10:01'),
(49, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-11 20:17:31'),
(50, 31, NULL, 'USER_REGISTRATION', NULL, NULL, 'New admin registered', '::ffff:127.0.0.1', NULL, '2026-04-11 20:25:33'),
(51, 32, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-11 20:40:43'),
(52, 32, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-11 20:47:09'),
(53, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-11 20:47:31'),
(54, 33, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-12 03:28:43'),
(55, 37, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-14 19:19:53'),
(56, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-14 19:35:53'),
(57, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-15 18:49:27'),
(58, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-15 18:50:03'),
(59, 37, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-15 18:59:46'),
(60, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:38:50'),
(61, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:40:49'),
(62, 43, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-16 02:42:22'),
(63, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:45:44'),
(64, 43, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:50:35'),
(65, 1, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:51:29'),
(66, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:52:28'),
(67, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 02:54:19'),
(68, 44, NULL, 'USER_REGISTRATION', NULL, NULL, 'New adopter registered', '::ffff:127.0.0.1', NULL, '2026-04-16 03:13:45'),
(69, 45, NULL, 'USER_REGISTRATION', NULL, NULL, 'New both registered', '::ffff:127.0.0.1', NULL, '2026-04-16 03:17:13'),
(70, 45, NULL, 'ADOPTION_INITIATED', 'adoption_application', 8, 'User initiated adoption application', NULL, NULL, '2026-04-16 03:17:51'),
(71, 43, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 03:20:54'),
(72, 46, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-16 03:22:37'),
(73, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 03:58:12'),
(74, 24, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 5, 'User created sponsorship', NULL, NULL, '2026-04-16 03:58:43'),
(75, 32, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 03:59:20'),
(76, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 03:59:41'),
(77, 46, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:00:04'),
(78, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:01:27'),
(79, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:02:42'),
(80, 24, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 6, 'User created sponsorship', NULL, NULL, '2026-04-16 04:03:21'),
(81, 46, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:03:38'),
(82, 46, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:04:59'),
(83, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:07:42'),
(84, 24, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 7, 'User created sponsorship', NULL, NULL, '2026-04-16 04:09:01'),
(85, 43, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:09:16'),
(86, 37, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-16 04:17:59'),
(87, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 01:18:22'),
(88, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 01:21:22'),
(89, 24, NULL, 'SPONSORSHIP_CREATED', 'sponsorship', 8, 'User created sponsorship', NULL, NULL, '2026-04-18 01:22:31'),
(90, 43, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 01:32:37'),
(91, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 02:15:33'),
(92, 43, NULL, 'ADOPTION_INITIATED', 'adoption_application', 9, 'User initiated adoption application', NULL, NULL, '2026-04-18 02:16:11'),
(93, 24, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 02:16:40'),
(94, 43, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 02:16:58'),
(95, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-18 17:37:53'),
(96, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 02:12:10'),
(97, 49, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-19 02:28:00'),
(98, 49, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 02:31:16'),
(99, 49, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 02:34:07'),
(100, 33, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 02:38:18'),
(101, 51, NULL, 'USER_REGISTRATION', NULL, NULL, 'New both registered', '::ffff:127.0.0.1', NULL, '2026-04-19 02:40:19'),
(102, 49, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 03:07:05'),
(103, 49, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 03:34:17'),
(104, 49, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 03:39:24'),
(105, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 03:39:45'),
(106, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 03:40:26'),
(107, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 04:58:02'),
(108, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 04:59:48'),
(109, 52, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-19 05:05:20'),
(110, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 05:09:40'),
(111, 51, NULL, 'ADOPTION_INITIATED', 'adoption_application', 10, 'User initiated adoption application', NULL, NULL, '2026-04-19 05:10:18'),
(112, 52, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 05:10:50'),
(113, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 05:14:57'),
(114, 52, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 05:15:36'),
(115, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 05:41:12'),
(116, 54, NULL, 'USER_REGISTRATION', NULL, NULL, 'New adopter registered', '::ffff:127.0.0.1', NULL, '2026-04-19 06:19:35'),
(117, 54, NULL, 'ADOPTION_INITIATED', 'adoption_application', 11, 'User initiated adoption application', NULL, NULL, '2026-04-19 06:22:17'),
(118, 54, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 06:25:11'),
(119, 54, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 06:30:10'),
(120, 55, NULL, 'USER_REGISTRATION', NULL, NULL, 'New orphanage registered', '::ffff:127.0.0.1', NULL, '2026-04-19 06:36:30'),
(121, 55, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 06:45:46'),
(122, 54, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 06:54:31'),
(123, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-19 08:21:01'),
(124, 51, NULL, 'USER_LOGIN', NULL, NULL, 'User logged in', '::ffff:127.0.0.1', NULL, '2026-04-23 07:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE IF NOT EXISTS `admin_users` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin','childcare_services','ngo_verifier','support') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `permissions` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`admin_id`, `username`, `email`, `password_hash`, `full_name`, `role`, `permissions`, `is_active`, `created_at`, `last_login`) VALUES
(1, 'superadmin', 'dev@littlebridge.lk', '$2b$12$4NMR1x201NPLRANh3swnSuN5d1WOZMUcTVcJB4kJCUCeYTWcBrU1a', 'Super Administrator (Developer)', 'super_admin', NULL, 1, '2026-04-10 15:49:45', '2026-04-19 06:52:07'),
(2, 'admin', 'lttlbrdg@gmail.com', '$2b$12$4NMR1x201NPLRANh3swnSuN5d1WOZMUcTVcJB4kJCUCeYTWcBrU1a', 'LittleBridge Administrator', 'admin', NULL, 1, '2026-04-10 15:49:45', '2026-04-19 03:39:04'),
(3, 'childcare', 'childcare@probation.gov.lk', '$2b$12$4NMR1x201NPLRANh3swnSuN5d1WOZMUcTVcJB4kJCUCeYTWcBrU1a', 'Probation and Child Care Services', 'childcare_services', NULL, 1, '2026-04-10 15:49:45', '2026-04-19 06:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `adoption_applications`
--

DROP TABLE IF EXISTS `adoption_applications`;
CREATE TABLE IF NOT EXISTS `adoption_applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `orphanage_id` int NOT NULL,
  `application_status` enum('initiated','documents_submitted','under_review','approved','rejected','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'initiated',
  `initiated_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expected_completion_date` date DEFAULT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `current_stage` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `admin_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`application_id`),
  KEY `orphanage_id` (`orphanage_id`),
  KEY `idx_applications_user` (`user_id`),
  KEY `idx_applications_status` (`application_status`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adoption_applications`
--

INSERT INTO `adoption_applications` (`application_id`, `user_id`, `orphanage_id`, `application_status`, `initiated_date`, `expected_completion_date`, `actual_completion_date`, `current_stage`, `notes`, `admin_notes`) VALUES
(1, 2, 1, 'initiated', '2026-04-04 10:00:12', '2026-10-04', NULL, 'Document Preparation', NULL, NULL),
(2, 1, 2, 'documents_submitted', '2026-04-04 10:18:52', '2026-10-04', NULL, 'Under Review', NULL, NULL),
(3, 1, 1, 'initiated', '2026-04-05 20:20:03', '2026-10-06', NULL, 'Document Preparation', NULL, NULL),
(4, 19, 1, 'initiated', '2026-04-06 04:51:51', '2026-10-06', NULL, 'Document Preparation', NULL, NULL),
(5, 22, 1, 'initiated', '2026-04-06 05:08:00', '2026-10-06', NULL, 'Document Preparation', NULL, NULL),
(6, 22, 2, 'initiated', '2026-04-06 05:10:58', '2026-10-06', NULL, 'Document Preparation', NULL, NULL),
(7, 24, 1, 'initiated', '2026-04-08 19:20:44', '2026-10-09', NULL, 'Document Preparation', NULL, NULL),
(8, 45, 5, 'initiated', '2026-04-16 03:17:51', '2026-10-16', NULL, 'Document Preparation', NULL, NULL),
(9, 43, 5, 'initiated', '2026-04-18 02:16:11', '2026-10-18', NULL, 'Document Preparation', NULL, NULL),
(10, 51, 9, 'initiated', '2026-04-19 05:10:18', '2026-10-19', NULL, 'Document Preparation', NULL, NULL),
(11, 54, 9, 'initiated', '2026-04-19 06:22:17', '2026-10-19', NULL, 'Document Preparation', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `adoption_documents`
--

DROP TABLE IF EXISTS `adoption_documents`;
CREATE TABLE IF NOT EXISTS `adoption_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_description` text COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_mandatory` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adoption_documents`
--

INSERT INTO `adoption_documents` (`document_id`, `country`, `state`, `document_name`, `document_description`, `description`, `is_mandatory`, `display_order`, `created_at`) VALUES
(1, 'USA', NULL, 'Birth Certificate', 'Official birth certificate of the adopting parent(s)', 'Official birth certificate of the adopting parent(s)', 1, 1, '2026-02-26 05:19:39'),
(2, 'USA', NULL, 'Marriage Certificate', 'If married, provide marriage certificate', 'If married, provide marriage certificate', 1, 2, '2026-02-26 05:19:39'),
(3, 'USA', NULL, 'Proof of Income', 'Last 3 months pay stubs or tax returns', 'Last 3 months pay stubs or tax returns', 1, 3, '2026-02-26 05:19:39'),
(4, 'USA', NULL, 'Criminal Background Check', 'FBI criminal background check clearance', 'FBI criminal background check clearance', 1, 4, '2026-02-26 05:19:39'),
(5, 'USA', NULL, 'Medical Examination Report', 'Complete medical examination from licensed physician', 'Complete medical examination from licensed physician', 1, 5, '2026-02-26 05:19:39'),
(6, 'USA', NULL, 'Home Study Report', 'Completed home study by licensed social worker', 'Completed home study by licensed social worker', 1, 6, '2026-02-26 05:19:39'),
(7, 'USA', NULL, 'Reference Letters', 'At least 3 personal reference letters', 'At least 3 personal reference letters', 1, 7, '2026-02-26 05:19:39'),
(8, 'USA', NULL, 'Employment Verification', 'Letter from employer verifying employment', 'Letter from employer verifying employment', 1, 8, '2026-02-26 05:19:39'),
(9, 'UK', NULL, 'Passport', 'Valid passport of adopting parent(s)', 'Valid passport of adopting parent(s)', 1, 1, '2026-02-26 05:19:39'),
(10, 'UK', NULL, 'Proof of Address', 'Utility bill or council tax statement', 'Utility bill or council tax statement', 1, 2, '2026-02-26 05:19:39'),
(11, 'UK', NULL, 'DBS Check', 'Enhanced Disclosure and Barring Service check', 'Enhanced Disclosure and Barring Service check', 1, 3, '2026-02-26 05:19:39'),
(12, 'UK', NULL, 'Financial Statement', 'Bank statements for last 6 months', 'Bank statements for last 6 months', 1, 4, '2026-02-26 05:19:39'),
(13, 'UK', NULL, 'Medical Certificate', 'GP medical certificate', 'GP medical certificate', 1, 5, '2026-02-26 05:19:39'),
(14, 'Sri Lanka', NULL, 'National Identity Card', 'NIC of adopting parent(s)', 'NIC of adopting parent(s)', 1, 1, '2026-02-26 05:19:39'),
(15, 'Sri Lanka', NULL, 'Birth Certificate', 'Certified copy of birth certificate', 'Certified copy of birth certificate', 1, 2, '2026-02-26 05:19:39'),
(16, 'Sri Lanka', NULL, 'Marriage Certificate', 'If applicable, certified marriage certificate', 'If applicable, certified marriage certificate', 1, 3, '2026-02-26 05:19:39'),
(17, 'Sri Lanka', NULL, 'Police Report', 'Character certificate from local police', 'Character certificate from local police', 1, 4, '2026-02-26 05:19:39'),
(18, 'Sri Lanka', NULL, 'Income Certificate', 'Proof of monthly income', 'Proof of monthly income', 1, 5, '2026-02-26 05:19:39'),
(19, 'Sri Lanka', NULL, 'Property Documents', 'Proof of property ownership or rental agreement', 'Proof of property ownership or rental agreement', 1, 6, '2026-02-26 05:19:39'),
(20, 'Sri Lanka', NULL, 'Medical Report', 'Medical fitness certificate', 'Medical fitness certificate', 1, 7, '2026-02-26 05:19:39'),
(21, 'Sri Lanka', NULL, 'Bank Statements (last 6 months)', '6 months of bank statements', '6 months of bank statements', 1, 8, '2026-04-10 15:48:40'),
(22, 'Sri Lanka', NULL, 'Two Reference Letters', 'Character references from community members', 'Character references from community members', 0, 9, '2026-04-10 15:48:40');

-- --------------------------------------------------------

--
-- Table structure for table `adoption_timeline`
--

DROP TABLE IF EXISTS `adoption_timeline`;
CREATE TABLE IF NOT EXISTS `adoption_timeline` (
  `timeline_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `stage_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stage_description` text COLLATE utf8mb4_unicode_ci,
  `stage_order` int NOT NULL,
  `expected_date` date DEFAULT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `status` enum('pending','in_progress','completed','skipped') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`timeline_id`),
  KEY `application_id` (`application_id`)
) ENGINE=MyISAM AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adoption_timeline`
--

INSERT INTO `adoption_timeline` (`timeline_id`, `application_id`, `stage_name`, `stage_description`, `stage_order`, `expected_date`, `actual_completion_date`, `status`, `notes`, `created_at`) VALUES
(1, 1, 'Document Preparation', NULL, 1, '2026-04-04', NULL, 'in_progress', NULL, '2026-04-04 10:00:12'),
(2, 1, 'Initial Application Submission', NULL, 2, '2026-04-18', NULL, 'pending', NULL, '2026-04-04 10:00:12'),
(3, 1, 'Background Check', NULL, 3, '2026-05-04', NULL, 'pending', NULL, '2026-04-04 10:00:12'),
(4, 1, 'Home Study Evaluation', NULL, 4, '2026-06-03', NULL, 'pending', NULL, '2026-04-04 10:00:12'),
(5, 1, 'Legal Review', NULL, 5, '2026-08-02', NULL, 'pending', NULL, '2026-04-04 10:00:12'),
(6, 1, 'Final Approval', NULL, 6, '2026-09-01', NULL, 'pending', NULL, '2026-04-04 10:00:12'),
(7, 1, 'Child Placement', NULL, 7, '2026-10-01', NULL, 'pending', NULL, '2026-04-04 10:00:12'),
(8, 2, 'Document Preparation', NULL, 1, '2026-04-04', '2026-04-04', 'completed', NULL, '2026-04-04 10:18:52'),
(9, 2, 'Initial Application Submission', NULL, 2, '2026-04-18', NULL, 'in_progress', NULL, '2026-04-04 10:18:52'),
(10, 2, 'Background Check', NULL, 3, '2026-05-04', NULL, 'pending', NULL, '2026-04-04 10:18:52'),
(11, 2, 'Home Study Evaluation', NULL, 4, '2026-06-03', NULL, 'pending', NULL, '2026-04-04 10:18:52'),
(12, 2, 'Legal Review', NULL, 5, '2026-08-02', NULL, 'pending', NULL, '2026-04-04 10:18:52'),
(13, 2, 'Final Approval', NULL, 6, '2026-09-01', NULL, 'pending', NULL, '2026-04-04 10:18:52'),
(14, 2, 'Child Placement', NULL, 7, '2026-10-01', NULL, 'pending', NULL, '2026-04-04 10:18:52'),
(15, 3, 'Document Preparation', NULL, 1, '2026-04-06', NULL, 'in_progress', NULL, '2026-04-05 20:20:03'),
(16, 3, 'Initial Application Submission', NULL, 2, '2026-04-20', NULL, 'pending', NULL, '2026-04-05 20:20:03'),
(17, 3, 'Background Check', NULL, 3, '2026-05-06', NULL, 'pending', NULL, '2026-04-05 20:20:03'),
(18, 3, 'Home Study Evaluation', NULL, 4, '2026-06-05', NULL, 'pending', NULL, '2026-04-05 20:20:03'),
(19, 3, 'Legal Review', NULL, 5, '2026-08-04', NULL, 'pending', NULL, '2026-04-05 20:20:03'),
(20, 3, 'Final Approval', NULL, 6, '2026-09-03', NULL, 'pending', NULL, '2026-04-05 20:20:03'),
(21, 3, 'Child Placement', NULL, 7, '2026-10-03', NULL, 'pending', NULL, '2026-04-05 20:20:03'),
(22, 4, 'Document Preparation', NULL, 1, '2026-04-06', NULL, 'in_progress', NULL, '2026-04-06 04:51:51'),
(23, 4, 'Initial Application Submission', NULL, 2, '2026-04-20', NULL, 'pending', NULL, '2026-04-06 04:51:51'),
(24, 4, 'Background Check', NULL, 3, '2026-05-06', NULL, 'pending', NULL, '2026-04-06 04:51:51'),
(25, 4, 'Home Study Evaluation', NULL, 4, '2026-06-05', NULL, 'pending', NULL, '2026-04-06 04:51:51'),
(26, 4, 'Legal Review', NULL, 5, '2026-08-04', NULL, 'pending', NULL, '2026-04-06 04:51:51'),
(27, 4, 'Final Approval', NULL, 6, '2026-09-03', NULL, 'pending', NULL, '2026-04-06 04:51:51'),
(28, 4, 'Child Placement', NULL, 7, '2026-10-03', NULL, 'pending', NULL, '2026-04-06 04:51:51'),
(29, 5, 'Document Preparation', NULL, 1, '2026-04-06', NULL, 'in_progress', NULL, '2026-04-06 05:08:00'),
(30, 5, 'Initial Application Submission', NULL, 2, '2026-04-20', NULL, 'pending', NULL, '2026-04-06 05:08:00'),
(31, 5, 'Background Check', NULL, 3, '2026-05-06', NULL, 'pending', NULL, '2026-04-06 05:08:00'),
(32, 5, 'Home Study Evaluation', NULL, 4, '2026-06-05', NULL, 'pending', NULL, '2026-04-06 05:08:00'),
(33, 5, 'Legal Review', NULL, 5, '2026-08-04', NULL, 'pending', NULL, '2026-04-06 05:08:00'),
(34, 5, 'Final Approval', NULL, 6, '2026-09-03', NULL, 'pending', NULL, '2026-04-06 05:08:00'),
(35, 5, 'Child Placement', NULL, 7, '2026-10-03', NULL, 'pending', NULL, '2026-04-06 05:08:00'),
(36, 6, 'Document Preparation', NULL, 1, '2026-04-06', NULL, 'in_progress', NULL, '2026-04-06 05:10:58'),
(37, 6, 'Initial Application Submission', NULL, 2, '2026-04-20', NULL, 'pending', NULL, '2026-04-06 05:10:58'),
(38, 6, 'Background Check', NULL, 3, '2026-05-06', NULL, 'pending', NULL, '2026-04-06 05:10:58'),
(39, 6, 'Home Study Evaluation', NULL, 4, '2026-06-05', NULL, 'pending', NULL, '2026-04-06 05:10:58'),
(40, 6, 'Legal Review', NULL, 5, '2026-08-04', NULL, 'pending', NULL, '2026-04-06 05:10:58'),
(41, 6, 'Final Approval', NULL, 6, '2026-09-03', NULL, 'pending', NULL, '2026-04-06 05:10:58'),
(42, 6, 'Child Placement', NULL, 7, '2026-10-03', NULL, 'pending', NULL, '2026-04-06 05:10:58'),
(43, 7, 'Document Preparation', NULL, 1, '2026-04-09', NULL, 'in_progress', NULL, '2026-04-08 19:20:44'),
(44, 7, 'Initial Application Submission', NULL, 2, '2026-04-23', NULL, 'pending', NULL, '2026-04-08 19:20:44'),
(45, 7, 'Background Check', NULL, 3, '2026-05-09', NULL, 'pending', NULL, '2026-04-08 19:20:44'),
(46, 7, 'Home Study Evaluation', NULL, 4, '2026-06-08', NULL, 'pending', NULL, '2026-04-08 19:20:44'),
(47, 7, 'Legal Review', NULL, 5, '2026-08-07', NULL, 'pending', NULL, '2026-04-08 19:20:44'),
(48, 7, 'Final Approval', NULL, 6, '2026-09-06', NULL, 'pending', NULL, '2026-04-08 19:20:44'),
(49, 7, 'Child Placement', NULL, 7, '2026-10-06', NULL, 'pending', NULL, '2026-04-08 19:20:44'),
(50, 8, 'Document Preparation', NULL, 1, '2026-04-16', NULL, 'in_progress', NULL, '2026-04-16 03:17:51'),
(51, 8, 'Initial Application Submission', NULL, 2, '2026-04-30', NULL, 'pending', NULL, '2026-04-16 03:17:51'),
(52, 8, 'Background Check', NULL, 3, '2026-05-16', NULL, 'pending', NULL, '2026-04-16 03:17:51'),
(53, 8, 'Home Study Evaluation', NULL, 4, '2026-06-15', NULL, 'pending', NULL, '2026-04-16 03:17:51'),
(54, 8, 'Legal Review', NULL, 5, '2026-08-14', NULL, 'pending', NULL, '2026-04-16 03:17:51'),
(55, 8, 'Final Approval', NULL, 6, '2026-09-13', NULL, 'pending', NULL, '2026-04-16 03:17:51'),
(56, 8, 'Child Placement', NULL, 7, '2026-10-13', NULL, 'pending', NULL, '2026-04-16 03:17:51'),
(57, 9, 'Document Preparation', NULL, 1, '2026-04-18', NULL, 'in_progress', NULL, '2026-04-18 02:16:11'),
(58, 9, 'Initial Application Submission', NULL, 2, '2026-05-02', NULL, 'pending', NULL, '2026-04-18 02:16:11'),
(59, 9, 'Background Check', NULL, 3, '2026-05-18', NULL, 'pending', NULL, '2026-04-18 02:16:11'),
(60, 9, 'Home Study Evaluation', NULL, 4, '2026-06-17', NULL, 'pending', NULL, '2026-04-18 02:16:11'),
(61, 9, 'Legal Review', NULL, 5, '2026-08-16', NULL, 'pending', NULL, '2026-04-18 02:16:11'),
(62, 9, 'Final Approval', NULL, 6, '2026-09-15', NULL, 'pending', NULL, '2026-04-18 02:16:11'),
(63, 9, 'Child Placement', NULL, 7, '2026-10-15', NULL, 'pending', NULL, '2026-04-18 02:16:11'),
(64, 10, 'Document Preparation', NULL, 1, '2026-04-19', NULL, 'in_progress', NULL, '2026-04-19 05:10:18'),
(65, 10, 'Initial Application Submission', NULL, 2, '2026-05-03', NULL, 'pending', NULL, '2026-04-19 05:10:18'),
(66, 10, 'Background Check', NULL, 3, '2026-05-19', NULL, 'pending', NULL, '2026-04-19 05:10:18'),
(67, 10, 'Home Study Evaluation', NULL, 4, '2026-06-18', NULL, 'pending', NULL, '2026-04-19 05:10:18'),
(68, 10, 'Legal Review', NULL, 5, '2026-08-17', NULL, 'pending', NULL, '2026-04-19 05:10:18'),
(69, 10, 'Final Approval', NULL, 6, '2026-09-16', NULL, 'pending', NULL, '2026-04-19 05:10:18'),
(70, 10, 'Child Placement', NULL, 7, '2026-10-16', NULL, 'pending', NULL, '2026-04-19 05:10:18'),
(71, 11, 'Document Preparation', NULL, 1, '2026-04-19', NULL, 'in_progress', NULL, '2026-04-19 06:22:17'),
(72, 11, 'Initial Application Submission', NULL, 2, '2026-05-03', NULL, 'pending', NULL, '2026-04-19 06:22:17'),
(73, 11, 'Background Check', NULL, 3, '2026-05-19', NULL, 'pending', NULL, '2026-04-19 06:22:17'),
(74, 11, 'Home Study Evaluation', NULL, 4, '2026-06-18', NULL, 'pending', NULL, '2026-04-19 06:22:17'),
(75, 11, 'Legal Review', NULL, 5, '2026-08-17', NULL, 'pending', NULL, '2026-04-19 06:22:17'),
(76, 11, 'Final Approval', NULL, 6, '2026-09-16', NULL, 'pending', NULL, '2026-04-19 06:22:17'),
(77, 11, 'Child Placement', NULL, 7, '2026-10-16', NULL, 'pending', NULL, '2026-04-19 06:22:17');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `orphanage_id` int NOT NULL,
  `sponsorship_id` int DEFAULT NULL,
  `appointment_type` enum('visit','donation_delivery','interview','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `appointment_date` datetime NOT NULL,
  `duration_minutes` int DEFAULT '60',
  `purpose` enum('visit','donation_delivery','interview','adoption_meeting','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'visit',
  `status` enum('scheduled','confirmed','cancelled','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'scheduled',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `orphanage_confirmed` tinyint(1) DEFAULT '0',
  `orphanage_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`appointment_id`),
  KEY `user_id` (`user_id`),
  KEY `orphanage_id` (`orphanage_id`),
  KEY `idx_appointments_date` (`appointment_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

DROP TABLE IF EXISTS `contact_submissions`;
CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interest` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_resolved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`submission_id`),
  KEY `idx_email` (`email`(250))
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`submission_id`, `first_name`, `last_name`, `email`, `interest`, `message`, `is_resolved`, `created_at`) VALUES
(1, 'sans', 'sans', 'asdsa@gmail.com', 'Sponsorship', 'asdsadsdsadasdadsad', 0, '2026-04-12 15:33:14'),
(2, 'Dimu', 'asda', 'aknnandasiri@gmail.com', 'Adoption Process', 'I wanna know about adoptation', 0, '2026-04-18 01:25:30'),
(3, 'john', 'lemnin', 'aknnandasiri@gmail.com', 'Adoption Process', 'I wanna know more', 0, '2026-04-19 03:27:42');

-- --------------------------------------------------------

--
-- Table structure for table `donation_needs`
--

DROP TABLE IF EXISTS `donation_needs`;
CREATE TABLE IF NOT EXISTS `donation_needs` (
  `need_id` int NOT NULL AUTO_INCREMENT,
  `orphanage_id` int NOT NULL,
  `category` enum('clothes','books','food','medical','educational','toys','monetary','essentials','art','sports','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `quantity_needed` int DEFAULT NULL,
  `quantity_received` int DEFAULT '0',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `status` enum('active','fulfilled','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`need_id`),
  KEY `orphanage_id` (`orphanage_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `donation_needs`
--

INSERT INTO `donation_needs` (`need_id`, `orphanage_id`, `category`, `item_name`, `description`, `quantity_needed`, `quantity_received`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'clothes', 'School Uniforms', 'School uniforms for children aged 6-12', 20, 0, 'high', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(2, 1, 'books', 'Educational Books', 'Grade 1-5 textbooks and story books', 100, 0, 'medium', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(3, 1, 'food', 'Rice and Lentils', 'Monthly supply of rice and lentils', 200, 0, 'urgent', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(4, 2, 'educational', 'Computer Equipment', 'Computers for computer lab', 5, 0, 'high', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(5, 2, 'toys', 'Sports Equipment', 'Cricket bats, balls, and other sports items', 15, 0, 'medium', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(6, 3, 'medical', 'First Aid Supplies', 'Basic first aid and medical supplies', 1, 0, 'urgent', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(7, 3, 'clothes', 'Winter Clothing', 'Warm clothes for winter season', 30, 0, 'high', 'active', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(8, 4, 'educational', 'ads', 'dasda', 55, 0, 'medium', 'active', '2026-04-15 19:00:09', '2026-04-15 19:00:09'),
(9, 6, 'clothes', 'addsa', 'adadsdadsds', 10, 0, 'medium', 'active', '2026-04-16 04:07:00', '2026-04-16 04:07:00'),
(10, 4, 'clothes', 'Uniforms', 'Unigorm one', 20, 0, 'medium', 'active', '2026-04-16 04:26:10', '2026-04-16 04:26:10'),
(11, 8, 'clothes', 'School Uniforms', 'Aluth Adum', 50, 0, 'medium', 'active', '2026-04-19 02:31:54', '2026-04-19 02:31:54'),
(12, 8, 'medical', 'Vitamin tablets', NULL, 100, 0, 'urgent', 'active', '2026-04-19 02:32:45', '2026-04-19 02:32:45'),
(13, 9, 'medical', 'School Uniforms', NULL, 50, 0, 'high', 'active', '2026-04-19 05:11:31', '2026-04-19 05:11:31'),
(14, 10, 'medical', 'Pandol ', NULL, 100, 0, 'urgent', 'active', '2026-04-19 06:46:56', '2026-04-19 06:46:56');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `orphanage_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `is_read` tinyint(1) DEFAULT '0',
  `action_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `orphanage_id`, `title`, `message`, `notification_type`, `is_read`, `action_url`, `created_at`) VALUES
(1, 5, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-04 09:53:16'),
(2, 2, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 0, NULL, '2026-04-04 10:00:12'),
(3, 1, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 1, NULL, '2026-04-04 10:18:52'),
(4, 1, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 1, NULL, '2026-04-05 20:20:03'),
(5, 15, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-05 20:35:50'),
(6, 15, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-05 20:37:11'),
(7, 19, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 0, NULL, '2026-04-06 04:51:51'),
(8, 20, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-06 05:00:03'),
(9, 22, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 0, NULL, '2026-04-06 05:08:00'),
(10, 22, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 0, NULL, '2026-04-06 05:10:58'),
(11, 24, NULL, 'Adoption Application Started', 'Your adoption journey has begun! Please prepare the required documents.', 'adoption_update', 1, NULL, '2026-04-08 19:20:44'),
(12, 1, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-15 18:51:51'),
(13, 1, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-16 02:39:16'),
(14, 1, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-16 02:39:43'),
(15, 45, NULL, 'Adoption Application Started', 'Your adoption journey with Ma piya Sewana has begun! Upload your documents to proceed.', 'adoption_update', 0, NULL, '2026-04-16 03:17:51'),
(16, 45, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-16 03:18:13'),
(17, 24, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-16 03:58:43'),
(18, 24, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-16 04:03:21'),
(19, 24, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-16 04:09:01'),
(20, 24, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-18 01:21:46'),
(21, 24, NULL, 'Sponsorship Confirmed', 'Thank you for your generous donation to the orphanage!', 'sponsorship_confirmation', 0, NULL, '2026-04-18 01:22:31'),
(22, 24, NULL, 'Document Approved: National Identity Card', 'Your \"National Identity Card\" has been verified by the Childcare Services Department.', 'document_uploaded', 0, NULL, '2026-04-18 02:14:51'),
(23, 43, NULL, 'Adoption Application Started', 'Your adoption journey with Ma piya Sewana has begun! Upload your documents to proceed.', 'adoption_update', 0, NULL, '2026-04-18 02:16:11'),
(24, 49, NULL, 'New Sponsorship Request', 'A sports donation request has been received. Please review and confirm.', 'sponsorship_request', 0, NULL, '2026-04-19 02:33:57'),
(25, 49, NULL, 'New Sponsorship Request', 'A food donation request has been received. Please review and confirm.', 'sponsorship_request', 0, NULL, '2026-04-19 03:06:52'),
(26, 49, NULL, 'New Sponsorship Request', 'A essentials donation request has been received. Please review and confirm.', 'sponsorship_request', 0, NULL, '2026-04-19 03:41:44'),
(27, 51, NULL, 'Adoption Application Started', 'Your adoption journey with Vajira Sri Children’s Development Center has begun! Upload your documents to proceed.', 'adoption_update', 0, NULL, '2026-04-19 05:10:18'),
(28, 51, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-19 05:10:32'),
(29, 52, NULL, 'New Sponsorship Request', 'A clothes donation request has been received. Please review and confirm.', 'sponsorship_request', 0, NULL, '2026-04-19 05:15:19'),
(30, 51, NULL, 'Document Uploaded', '\"Birth Certificate\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-19 05:41:46'),
(31, 51, NULL, 'Document Approved: Birth Certificate', 'Your \"Birth Certificate\" has been verified by the Childcare Services Department.', 'document_uploaded', 0, NULL, '2026-04-19 05:59:17'),
(32, 54, NULL, 'Adoption Application Started', 'Your adoption journey with Vajira Sri Children’s Development Center has begun! Upload your documents to proceed.', 'adoption_update', 0, NULL, '2026-04-19 06:22:17'),
(33, 54, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-19 06:22:48'),
(34, 54, NULL, 'Document Needs Attention: National Identity Card', 'Your \"National Identity Card\" needs resubmission.', 'adoption_update', 0, NULL, '2026-04-19 06:24:02'),
(35, 54, NULL, 'Document Uploaded', '\"National Identity Card\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-19 06:26:24'),
(36, 54, NULL, 'Document Uploaded', '\"Birth Certificate\" has been uploaded and is pending verification by Childcare Services.', 'document_uploaded', 0, NULL, '2026-04-19 06:27:01'),
(37, 54, NULL, 'Document Approved: National Identity Card', 'Your \"National Identity Card\" has been verified by the Childcare Services Department.', 'document_uploaded', 0, NULL, '2026-04-19 06:28:44'),
(38, 54, NULL, 'Document Approved: Birth Certificate', 'Your \"Birth Certificate\" has been verified by the Childcare Services Department.', 'document_uploaded', 0, NULL, '2026-04-19 06:28:54'),
(39, 55, NULL, 'Orphanage Approved ✓', 'Samadhi Sewana is now live on LittleBridge. Sponsors and families can find you.', 'orphanage_approved', 0, NULL, '2026-04-19 06:44:59');

-- --------------------------------------------------------

--
-- Table structure for table `orphanages`
--

DROP TABLE IF EXISTS `orphanages`;
CREATE TABLE IF NOT EXISTS `orphanages` (
  `orphanage_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `capacity` int DEFAULT NULL,
  `current_children_count` int DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `verified_by` int DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`orphanage_id`),
  UNIQUE KEY `registration_number` (`registration_number`),
  UNIQUE KEY `email` (`email`),
  KEY `verified_by` (`verified_by`),
  KEY `idx_orphanages_location` (`latitude`,`longitude`),
  KEY `idx_orphanages_status` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orphanages`
--

INSERT INTO `orphanages` (`orphanage_id`, `user_id`, `name`, `registration_number`, `email`, `phone`, `address`, `city`, `state`, `country`, `latitude`, `longitude`, `capacity`, `current_children_count`, `description`, `website`, `license_document`, `status`, `verified_by`, `verified_at`, `rejection_reason`, `submitted_at`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Hope Children Home', 'ORG-2024-001', 'contact@hopechildren.org', '+94-11-2345678', '123 Main Street, Colombo 07', 'Colombo', 'Western Province', 'Sri Lanka', 6.92710000, 79.86120000, 50, 0, 'Providing care and education to underprivileged children since 1995', NULL, NULL, 'approved', 1, '2026-02-26 05:19:39', NULL, '2026-04-10 15:44:28', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(2, NULL, 'Sunshine Orphanage', 'ORG-2024-002', 'info@sunshine.lk', '+94-81-2234567', '45 Temple Road, Kandy', 'Kandy', 'Central Province', 'Sri Lanka', 7.29060000, 80.63370000, 40, 0, 'A loving home for children in need', NULL, NULL, 'approved', 1, '2026-02-26 05:19:39', NULL, '2026-04-10 15:44:28', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(3, NULL, 'Little Angels Home', 'ORG-2024-003', 'angels@littleangels.org', '+94-91-2234891', '78 Beach Road, Galle', 'Galle', 'Southern Province', 'Sri Lanka', 6.05350000, 80.22100000, 35, 0, 'Dedicated to giving every child a bright future', NULL, NULL, 'approved', 1, '2026-02-26 05:19:39', NULL, '2026-04-10 15:44:28', '2026-02-26 05:19:39', '2026-02-26 05:19:39'),
(4, 37, 'New Arise Children\'s Home', 'ORG-2026-FYZ', 'saman@gmail.com', '0112456345', 'No 72/2, Kandewatta, Nugegoda.', 'Colombo', 'Western Province', 'Sri Lanka', 6.87631650, 79.88671550, 15, 0, 'We love the children. ', '', NULL, 'approved', NULL, NULL, NULL, '2026-04-14 19:27:42', '2026-04-14 19:27:42', '2026-04-15 18:56:44'),
(5, 43, 'Ma piya Sewana', 'ORG-2026-456', 'nipuniniwarthana@gmail.com', '0112345678', '146/12, Rukmale, Pannipitiya.', 'Colombo', 'Western Province', 'Sri Lanka', 6.85685490, 79.97793850, 30, 0, 'WE love our kids, happy new year', '', NULL, 'approved', NULL, NULL, NULL, '2026-04-16 02:45:08', '2026-04-16 02:45:08', '2026-04-16 02:50:52'),
(6, 46, 'Lama niwasa Ape gedara', 'ORG-2026-05', 'nivarthanaradn65@gmail.com', '0767436178', '175, old road, Maharagama.', 'Colombo', 'Western Province', 'Sri Lanka', 6.87375720, 79.94813040, 56, 0, 'Ape lamai nehe thama ', '', NULL, 'approved', NULL, NULL, NULL, '2026-04-16 03:24:30', '2026-04-16 03:24:30', '2026-04-16 04:00:50'),
(8, 49, 'Oba Mama Children Village - Oba Mama Association', 'ORG-2026-879', 'boxmart.lk@gmail.com', '0766561630', '14, Rukkandala, Mathara', 'Matara', 'Southern Province', 'Sri Lanka', 5.96137390, 80.60068750, 100, 0, 'Api lamainta hari adarei', '', NULL, 'approved', NULL, NULL, NULL, '2026-04-19 02:30:03', '2026-04-19 02:30:03', '2026-04-19 02:31:07'),
(9, 52, 'Vajira Sri Children’s Development Center', 'ORG-2026-oip', 'vidud20@gmail.com', '0768661516', 'Vajira Sri Children’s Development Center, 21/25 Ananda Balika Mawatha, Sri Jayawardenepura Kotte', 'Colombo', 'Western Province', 'Sri Lanka', 6.90920010, 79.86328270, 150, 0, 'Sri Jayawardenapura Vajira Sri Children’s Development Center was established in 1983 with 101 destitute children who were the victims of the civil war in the Northern province of Sri Lanka. The goal was to provide shelter and hope for these young children who had lost their mothers and fathers as a result of the ruthless war. Our ultimate goal is to create a better future for children by assisting them with complete impartiality and without regard for race or religious beliefs.', 'http://vajirasri.com/', NULL, 'approved', NULL, NULL, NULL, '2026-04-19 05:08:57', '2026-04-19 05:08:57', '2026-04-19 05:09:58'),
(10, 55, 'Samadhi Sewana', 'ORG - 2345 - 6787', 'samadhisewana@gmail.com', '0767865345', '134/12, pannipitiya', 'Colombo', 'Western Province', 'Sri Lanka', 6.87649450, 79.71184020, 20, 0, 'established in 1983 with 101 destitute children who were the victims of the civil war in the Northern province of Sri Lanka. The goal was to provide shelter and hope for these young children who had lost their mothers and fathers as a result of the ruthless war. Our ultimate goal is to create a better future for children by assisting them with complete impartiality and without regard for race or religious beliefs. ', '', NULL, 'approved', NULL, '2026-04-19 06:44:59', NULL, '2026-04-19 06:43:50', '2026-04-19 06:43:50', '2026-04-19 06:44:59');

-- --------------------------------------------------------

--
-- Table structure for table `orphanage_sponsorship_stats`
--

DROP TABLE IF EXISTS `orphanage_sponsorship_stats`;
CREATE TABLE IF NOT EXISTS `orphanage_sponsorship_stats` (
  `stat_id` int NOT NULL AUTO_INCREMENT,
  `orphanage_id` int NOT NULL,
  `total_sponsorships` int DEFAULT '0',
  `last_sponsorship_date` date DEFAULT NULL,
  `sponsorships_last_30_days` int DEFAULT '0',
  `sponsorships_last_90_days` int DEFAULT '0',
  `total_amount_received` decimal(12,2) DEFAULT '0.00',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`stat_id`),
  UNIQUE KEY `orphanage_id` (`orphanage_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orphanage_sponsorship_stats`
--

INSERT INTO `orphanage_sponsorship_stats` (`stat_id`, `orphanage_id`, `total_sponsorships`, `last_sponsorship_date`, `sponsorships_last_30_days`, `sponsorships_last_90_days`, `total_amount_received`, `updated_at`) VALUES
(1, 1, 7, '2026-04-06', 4, 0, 0.00, '2026-04-06 05:00:03'),
(2, 2, 13, '2026-04-06', 6, 0, 0.00, '2026-04-05 20:37:11'),
(3, 3, 4, '2026-04-04', 2, 0, 0.00, '2026-04-04 09:53:16'),
(4, 4, 1, '2026-04-16', 1, 0, 0.00, '2026-04-16 03:58:43'),
(5, 6, 1, '2026-04-16', 1, 0, 0.00, '2026-04-16 04:03:21'),
(6, 5, 2, '2026-04-18', 2, 0, 0.00, '2026-04-18 01:22:31'),
(7, 10, 0, NULL, 0, 0, 0.00, '2026-04-19 06:44:59');

-- --------------------------------------------------------

--
-- Table structure for table `sponsorships`
--

DROP TABLE IF EXISTS `sponsorships`;
CREATE TABLE IF NOT EXISTS `sponsorships` (
  `sponsorship_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `orphanage_id` int NOT NULL,
  `donation_type` enum('one_time','recurring','scheduled','monetary','goods','visit') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'one_time',
  `amount` decimal(10,2) DEFAULT NULL,
  `category` enum('clothes','books','food','medical','educational','toys','monetary','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci,
  `scheduled_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `status` enum('pledged','confirmed','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pledged',
  `payment_status` enum('pending','completed','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `is_anonymous` tinyint(1) DEFAULT '0',
  `orphanage_confirmed` tinyint(1) DEFAULT '0',
  `orphanage_confirmed_at` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sponsorship_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_sponsorships_orphanage` (`orphanage_id`),
  KEY `idx_sponsorships_date` (`scheduled_date`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sponsorships`
--

INSERT INTO `sponsorships` (`sponsorship_id`, `user_id`, `orphanage_id`, `donation_type`, `amount`, `category`, `item_description`, `scheduled_date`, `delivery_date`, `status`, `payment_status`, `is_anonymous`, `orphanage_confirmed`, `orphanage_confirmed_at`, `notes`, `created_at`, `updated_at`) VALUES
(1, 5, 3, '', NULL, 'medical', '10 sets of pandol', '2026-04-17', NULL, 'pledged', 'pending', 1, 0, NULL, NULL, '2026-04-04 09:53:16', '2026-04-04 09:53:16'),
(2, 15, 1, '', NULL, 'food', '10 Kilos of Red Rice', '2026-04-10', NULL, 'pledged', 'pending', 1, 0, NULL, NULL, '2026-04-05 20:35:50', '2026-04-05 20:35:50'),
(3, 15, 2, '', NULL, 'books', 'I\'m bringing 10 pcs of Harry poter', '2026-04-30', NULL, 'pledged', 'pending', 0, 0, NULL, NULL, '2026-04-05 20:37:11', '2026-04-05 20:37:11'),
(4, 20, 1, '', 1000.00, 'monetary', 'Monetary donation of LKR 1000', '2026-04-07', NULL, 'pledged', 'pending', 0, 0, NULL, NULL, '2026-04-06 05:00:03', '2026-04-06 05:00:03'),
(5, 24, 4, 'goods', NULL, 'books', 'hapan Pancha poth', '2026-04-30', NULL, 'pledged', 'pending', 0, 0, NULL, NULL, '2026-04-16 03:58:43', '2026-04-16 03:58:43'),
(6, 24, 6, 'goods', NULL, '', 'kema jathi', '2026-04-30', NULL, 'pledged', 'pending', 0, 0, NULL, NULL, '2026-04-16 04:03:21', '2026-04-16 04:03:21'),
(7, 24, 5, 'goods', NULL, 'medical', 'pandol', '2026-04-27', NULL, 'pledged', 'pending', 0, 0, NULL, NULL, '2026-04-16 04:09:01', '2026-04-16 04:09:01'),
(8, 24, 5, 'monetary', 2500.00, 'monetary', 'Monetary donation of LKR 2500', '2026-04-29', NULL, 'pledged', 'pending', 0, 0, NULL, NULL, '2026-04-18 01:22:31', '2026-04-18 01:22:31'),
(9, 50, 8, 'goods', NULL, '', 'Foot Balls', '2026-04-28', NULL, '', 'pending', 0, 0, NULL, NULL, '2026-04-19 02:33:57', '2026-04-19 02:33:57'),
(10, 51, 8, 'goods', NULL, 'food', 'Apples 10 pieces', '2026-04-30', NULL, '', 'pending', 0, 0, NULL, NULL, '2026-04-19 03:06:52', '2026-04-19 03:06:52'),
(11, 51, 8, 'goods', NULL, '', 'Toys and Utensils ', '2026-05-08', NULL, '', 'pending', 0, 0, NULL, NULL, '2026-04-19 03:41:44', '2026-04-19 03:41:44'),
(12, 51, 9, 'goods', NULL, 'clothes', 'Uniforms 10 sets', '2026-05-08', NULL, '', 'pending', 0, 0, NULL, NULL, '2026-04-19 05:15:19', '2026-04-19 05:15:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `user_type` enum('adopter','sponsor','both','admin','orphanage','childcare_services') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_guest` tinyint(1) DEFAULT '0',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_location` (`latitude`,`longitude`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `address`, `city`, `state`, `country`, `latitude`, `longitude`, `user_type`, `is_guest`, `email_verified`, `created_at`, `updated_at`, `last_login`, `status`) VALUES
(1, 'sample@gmail.com', '$2b$12$Wuz6.ZI2.wJSu66l.O2qZOfMXwkFCoWm14vLwmC.7T5i81kVOJDvu', 'ssdasdsa', 'asdsad', '0766561630', NULL, 'Colombo', 'Western Province', 'Sri Lanka', NULL, NULL, 'adopter', 0, 0, '2026-03-13 04:22:49', '2026-04-16 02:51:29', '2026-04-16 02:51:29', 'active'),
(42, 'guest_1776279329801_uijo5@temp.lb', '$2b$12$ni8HBykVJcvkCK5v3h.zuOJUs5Gq9GBLwMf.tB/Pkf1gnZ4REe43u', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-15 18:55:30', '2026-04-15 18:55:30', NULL, 'active'),
(41, 'guest_1776278537672_ookn9@temp.lb', '$2b$12$eNVAN9X2mYYJgzPY6m229OfByV8f936r7Esp3a2Q3Bv1cZsaaIMhC', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-15 18:42:17', '2026-04-15 18:42:17', NULL, 'active'),
(40, 'guest_1776195258013_mjtbb@temp.lb', '$2b$12$yU.kXVD/rXkn3OG1a.U27O3KT/YZrws0zBPYmLdg0cYMeXSExVsEe', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-14 19:34:18', '2026-04-14 19:34:18', NULL, 'active'),
(39, 'guest_1776195256020_im5fv@temp.lb', '$2b$12$TmtY2zwLE4pKnsgBHvu.eu.9v0B1qEWJTfEt2beEqhizixBkhAm2i', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-14 19:34:16', '2026-04-14 19:34:16', NULL, 'active'),
(38, 'guest_1776195227997_f3jx8@temp.lb', '$2b$12$qR4BTVAVFDU/HikZZWXm0unhzDXHzQau7GZKXbkbEVlpYCdmsAubG', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-14 19:33:48', '2026-04-14 19:33:48', NULL, 'active'),
(37, 'saman@gmail.com', '$2b$12$.dsha/bW3aJ.oFzwf2Usce9TU3JcgKJwAN5/5oqTuFkX39GbDRi1q', 'Saman', 'Sanajhya', '0754535135', NULL, 'Colombo', 'Western Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-14 19:19:53', '2026-04-16 04:17:59', '2026-04-16 04:17:59', 'active'),
(24, 'vidu@gmail.com', '$2b$12$R0Lj/FbR.bUZh.aSNhETGu2KBtD.Pbb.VsAzZ3oPv7IfcrcdQbIJy', 'Vidu', 'Dulan', '0776756452', NULL, 'Maharagama', NULL, 'Sri Lanka', NULL, NULL, 'both', 0, 0, '2026-04-08 19:17:23', '2026-04-18 02:16:40', '2026-04-18 02:16:40', 'active'),
(51, 'aknnandasiri@gmail.com', '$2b$12$p5u.oksVhMqKsqqqisp8cObXzYCkI0DtXTg8BNEjbBTl1Wh.goLTy', 'Nimal', 'Nandasiri', '0718071522', NULL, 'Mathugama', 'Western Province', 'Sri Lanka', NULL, NULL, 'both', 0, 0, '2026-04-19 02:40:19', '2026-04-23 07:31:44', '2026-04-23 07:31:44', 'active'),
(34, 'guest_1775964803557_ujcnj@temp.lb', '$2b$12$LTUp9NZ7pQWieLpRGS6ebeOfJvGgIMczyplYjcrOo6plnuclv8Wua', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-12 03:33:23', '2026-04-12 03:33:23', NULL, 'active'),
(35, 'guest_1775965069893_j5z4w@temp.lb', '$2b$12$BRz0/MVdyS.UqgXpVRS1gupNeVYBzsbCLsMasK4rDXoM8VT3uX6C.', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-12 03:37:50', '2026-04-12 03:37:50', NULL, 'active'),
(32, 'niwasa@gmail.com', '$2b$12$x5uCIy7FtgFGm5P8b8JDkO1wmR6hTMtuX4njuBEslfAIAIcUC.x2m', 'Lama', 'Niwasa', '0776765615', NULL, 'Kandy', 'as', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-11 20:40:43', '2026-04-16 03:59:20', '2026-04-16 03:59:20', 'active'),
(36, 'guest_1776008225366_7adew@temp.lb', '$2b$12$qiga0K8hKq9yNzVGG4LuvucEHzubOSnC1uAOUkxCPCZDUh1HH8k5m', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-12 15:37:05', '2026-04-12 15:37:05', NULL, 'active'),
(31, 'sjan@gmail.com', '$2b$12$kZLAox9iUeUwfzBbJZSk4.KSneH/J2ojwdQHeUJN7Q4bDfPkPudiq', 'Sjan', 'Sjan', '0766561630', NULL, 'sadsasdasd', 'asd', 'Sri Lanka', NULL, NULL, 'admin', 0, 0, '2026-04-11 20:25:33', '2026-04-11 20:25:33', NULL, 'active'),
(30, 'guest_1775938581957_u0kn8@temp.lb', '$2b$12$mAwEkNGVs.sMxBkWvtKebO/g33wsID5cAHpnX7Is66BejxckrldPG', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-11 20:16:22', '2026-04-11 20:16:22', NULL, 'active'),
(29, 'priya@gmail.com', '$2b$12$U6V8dm26j.uwY4g/uvbLmOr2.3jsitbiMQKdEBSShT/NYtfVZAL/u', 'Priya', 'Sewana', '+9478878623', NULL, 'Colombo', 'Western Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-11 20:10:01', '2026-04-11 20:10:01', NULL, 'active'),
(43, 'nipuniniwarthana@gmail.com', '$2b$12$KwOsl8jpH9FPtb5rL/bst.XKo.zWNHbNOQIeJztTSO31VAro7M6Hm', 'Nipuni', 'Niwarthana', '0776544536', NULL, 'Homagama', 'Western Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-16 02:42:22', '2026-04-18 02:16:58', '2026-04-18 02:16:58', 'active'),
(44, 'asjkdhaskjdkjsahld@gmail.com', '$2b$12$CNP/JK0vMr/mX8RKrM8KOurv92NAQY5BNlsdIdBjLk4xVp7fVzOxe', 'asjkdhaskjdkjsahld', 'asjkdhaskjdkjsahld', '077654140', NULL, 'dfgf', 'dfsdf', 'Sri Lanka', NULL, NULL, 'adopter', 0, 0, '2026-04-16 03:13:45', '2026-04-16 03:13:45', NULL, 'active'),
(46, 'nivarthanaradn65@gmail.com', '$2b$12$iGTfbyLBC8uD24Mi.4y.KeMtLelbZQjC4MVE3ac0KxLTKRrKSc2Z.', 'Hema', 'Hema', '0767436178', NULL, 'kottawa', 'Western Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-16 03:22:37', '2026-04-16 04:04:59', '2026-04-16 04:04:59', 'active'),
(47, 'guest_1776313019406_82wvd@temp.lb', '$2b$12$OwM2.L6fxkcasLUjLyao8eFEJJvvoawsmulB0mA4swf32AlXRPaHu', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-16 04:16:59', '2026-04-16 04:16:59', NULL, 'active'),
(48, 'guest_1776475138073_yf920@temp.lb', '$2b$12$MN0G68AuEjZDcaZUSLMFJ.ya8dPsCJO59kv/lCwkh1BAJEUGinOq2', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-18 01:18:58', '2026-04-18 01:18:58', NULL, 'active'),
(49, 'boxmartlk@gmail.com', '$2b$12$CPZVLbqKvTHBnDQ1lNcMDelxmiSUs5hz0vJNxMZiKzXPkL9Fa8AmS', 'Obama', 'Happy Kids', '0766561630', NULL, 'Mathara', 'Southern Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-19 02:28:00', '2026-04-19 03:39:24', '2026-04-19 03:39:24', 'active'),
(50, 'guest_1776565998676_07rke@temp.lb', '$2b$12$83Ao5d2hBfiUEDM4HrDEtO99x37J0MyUZ1xp/idYblXnrz5wRRdsi', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-19 02:33:18', '2026-04-19 02:33:18', NULL, 'active'),
(52, 'vidud20@gmail.com', '$2b$12$nPH37aVqLiPQ7Auc/yAst.7qBrYluyLW9UVSyHYR07xJPcafXix0m', 'Jamal', 'Jamali', '0768661516', NULL, 'Maharagama', 'Western Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-19 05:05:20', '2026-04-19 05:15:36', '2026-04-19 05:15:36', 'active'),
(53, 'guest_1776578127135_sda58@temp.lb', '$2b$12$1ZSGkomLpukFIWwhy1cXQuUx4q1PWUHBnGfs7Bq1UJwpir8Gn1M2u', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-19 05:55:27', '2026-04-19 05:55:27', NULL, 'active'),
(54, 'naduncharuka@gmail.com', '$2b$12$OZQgWwER2Up5GyxpHosA2eX5jKJP5hHqL8wVhK4tessP17E1DLmo6', 'NADUN', 'charuka', '0767678190', NULL, 'homagama', 'western province', 'Sri Lanka', NULL, NULL, 'adopter', 0, 0, '2026-04-19 06:19:35', '2026-04-19 06:54:31', '2026-04-19 06:54:31', 'active'),
(55, 'amarakarunadewa@gmail.com', '$2b$12$ubxmwLgBzveE1pXEufl99ejzovV5wUvbn2/xg1JyFqjk6QHoH88WW', 'Amara', 'Karunadewa', '0757788980', NULL, 'Jaffna', 'North Province', 'Sri Lanka', NULL, NULL, 'orphanage', 0, 0, '2026-04-19 06:36:30', '2026-04-19 06:45:46', '2026-04-19 06:45:46', 'active'),
(56, 'guest_1776581233328_8cnw4@temp.lb', '$2b$12$XP7TxJ2Sg5nYuye/VkKkQeYlFMPTjsDghT/5I3EYodGSHIKqVCzPe', 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sponsor', 1, 0, '2026-04-19 06:47:13', '2026-04-19 06:47:13', NULL, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user_documents`
--

DROP TABLE IF EXISTS `user_documents`;
CREATE TABLE IF NOT EXISTS `user_documents` (
  `upload_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `document_id` int NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size_bytes` int DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification_status` enum('pending','verified','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `verified_by` int DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `approved_by_childcare` tinyint(1) DEFAULT '0',
  `childcare_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`upload_id`),
  KEY `application_id` (`application_id`),
  KEY `document_id` (`document_id`),
  KEY `verified_by` (`verified_by`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_documents`
--

INSERT INTO `user_documents` (`upload_id`, `application_id`, `document_id`, `file_path`, `file_name`, `file_size_bytes`, `upload_date`, `verification_status`, `verified_by`, `verified_at`, `rejection_reason`, `approved_by_childcare`, `childcare_notes`) VALUES
(1, 2, 1, 'uploads\\documents\\doc-1775297943723-440125170.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:03', 'pending', NULL, NULL, NULL, 0, NULL),
(2, 2, 2, 'uploads\\documents\\doc-1775297956428-338586585.pdf', 'MARKING SCHEME.pdf', NULL, '2026-04-04 10:19:16', 'pending', NULL, NULL, NULL, 0, NULL),
(3, 2, 3, 'uploads\\documents\\doc-1775297959770-704183289.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:19', 'pending', NULL, NULL, NULL, 0, NULL),
(4, 2, 4, 'uploads\\documents\\doc-1775297963664-907772188.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:23', 'pending', NULL, NULL, NULL, 0, NULL),
(5, 2, 5, 'uploads\\documents\\doc-1775297965956-264570370.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:25', 'pending', NULL, NULL, NULL, 0, NULL),
(6, 2, 6, 'uploads\\documents\\doc-1775297968228-164539159.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:28', 'pending', NULL, NULL, NULL, 0, NULL),
(7, 2, 7, 'uploads\\documents\\doc-1775297970796-164915593.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:30', 'pending', NULL, NULL, NULL, 0, NULL),
(8, 2, 8, 'uploads\\documents\\doc-1775297973232-841842990.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-04 10:19:33', 'pending', NULL, NULL, NULL, 0, NULL),
(9, 3, 1, 'uploads\\documents\\doc-1775420927288-973805839.jpeg', 'WhatsApp Image 2026-03-20 at 10.25.53.jpeg', NULL, '2026-04-05 20:28:47', 'pending', NULL, NULL, NULL, 0, NULL),
(10, 3, 2, 'uploads\\documents\\doc-1775420934327-315637821.jpeg', 'WhatsApp Image 2026-03-20 at 10.27.34.jpeg', NULL, '2026-04-05 20:28:54', 'pending', NULL, NULL, NULL, 0, NULL),
(11, 4, 1, 'uploads\\documents\\doc-1775451176207-304377552.pdf', 'MARKING SCHEME.pdf', NULL, '2026-04-06 04:52:56', 'pending', NULL, NULL, NULL, 0, NULL),
(12, 7, 1, 'uploads\\documents\\doc-1775676125450-255285979.png', 'Black and White Simple Thank You Card.png', NULL, '2026-04-08 19:22:05', 'pending', NULL, NULL, NULL, 0, NULL),
(13, 7, 2, 'uploads\\documents\\doc-1775677502385-134158978.png', 'âPngtreeâfragile please handle with care_7768913.png', NULL, '2026-04-08 19:45:02', 'pending', NULL, NULL, NULL, 0, NULL),
(14, 7, 3, 'uploads\\documents\\doc-1775677547115-60858658.png', 'Gemini_Generated_Image_2kk1ma2kk1ma2kk1.png', NULL, '2026-04-08 19:45:47', 'pending', NULL, NULL, NULL, 0, NULL),
(15, 3, 14, 'uploads/documents/doc-1776279111210-948353284.jpeg', 'WhatsApp Image 2026-03-20 at 11.38.00.jpeg', 262997, '2026-04-15 18:51:51', 'pending', NULL, NULL, NULL, 0, NULL),
(16, 3, 14, 'uploads/documents/doc-1776307156553-214141456.png', 'Google Maps Lat and lang extraction.png', 79868, '2026-04-16 02:39:16', 'pending', NULL, NULL, NULL, 0, NULL),
(17, 3, 14, 'uploads/documents/doc-1776307183060-322647530.jpg', 'IMG-20251127-WA0014.jpg', 5772831, '2026-04-16 02:39:43', 'pending', NULL, NULL, NULL, 0, NULL),
(18, 8, 14, 'uploads/documents/doc-1776309493075-759568186.jpg', 'IMG-20251127-WA0014.jpg', 5772831, '2026-04-16 03:18:13', 'pending', NULL, NULL, NULL, 0, NULL),
(19, 7, 14, 'uploads/documents/doc-1776475306000-227912845.jpg', 'IMG-20251127-WA0014.jpg', 5772831, '2026-04-18 01:21:46', 'verified', NULL, '2026-04-18 02:14:51', NULL, 1, NULL),
(20, 10, 14, 'uploads/documents/doc-1776575431998-797319085.jpg', 'IMG-20251127-WA0014.jpg', 5772831, '2026-04-19 05:10:32', 'pending', NULL, NULL, NULL, 0, NULL),
(21, 10, 15, 'uploads/documents/doc-1776577306060-767928131.jpg', 'WhatsApp Image 2025-11-27 at 15.45.17_e58fd589.jpg', 207126, '2026-04-19 05:41:46', 'verified', NULL, '2026-04-19 05:59:17', NULL, 1, NULL),
(22, 11, 14, 'uploads/documents/doc-1776579768539-189841157.jpg', '20251127_153820.jpg', 1111210, '2026-04-19 06:22:48', 'rejected', NULL, '2026-04-19 06:24:02', NULL, 0, NULL),
(23, 11, 14, 'uploads/documents/doc-1776579984620-942109767.jpg', 'WhatsApp Image 2025-11-27 at 15.42.50_c26a03e2.jpg', 68566, '2026-04-19 06:26:24', 'verified', NULL, '2026-04-19 06:28:44', NULL, 1, NULL),
(24, 11, 15, 'uploads/documents/doc-1776580021143-832762966.jpg', 'WhatsApp Image 2025-11-27 at 15.45.17_e58fd589.jpg', 207126, '2026-04-19 06:27:01', 'verified', NULL, '2026-04-19 06:28:54', NULL, 1, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
