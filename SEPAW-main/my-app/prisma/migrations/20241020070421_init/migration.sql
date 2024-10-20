-- CreateTable
CREATE TABLE `status` (
    `status_id` INTEGER NOT NULL AUTO_INCREMENT,
    `status_name` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gender` (
    `gender_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gender_describe` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`gender_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marrystatus` (
    `marry_id` INTEGER NOT NULL AUTO_INCREMENT,
    `marry_describe` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`marry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `users_id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_line_id` VARCHAR(33) NOT NULL,
    `users_fname` VARCHAR(100) NOT NULL,
    `users_sname` VARCHAR(100) NOT NULL,
    `users_status_onweb` INTEGER NOT NULL DEFAULT 0,
    `users_number` VARCHAR(10) NULL,
    `users_moo` VARCHAR(5) NULL,
    `users_road` VARCHAR(200) NULL,
    `users_tubon` VARCHAR(100) NULL,
    `users_amphur` VARCHAR(100) NULL,
    `users_province` VARCHAR(100) NULL,
    `users_postcode` VARCHAR(5) NULL,
    `users_tel1` VARCHAR(12) NULL,
    `users_passwd` VARCHAR(100) NOT NULL,
    `users_pin` INTEGER NOT NULL,
    `status_id` INTEGER NOT NULL,
    `users_alert_battery` INTEGER NULL DEFAULT 0,
    `users_status_active` INTEGER NOT NULL DEFAULT 1,
    `users_related_borrow` VARCHAR(255) NULL,
    `users_token` TEXT NULL,
    `users_user` VARCHAR(100) NULL,

    PRIMARY KEY (`users_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `takecareperson` (
    `users_id` INTEGER NOT NULL,
    `takecare_id` INTEGER NOT NULL AUTO_INCREMENT,
    `takecare_fname` VARCHAR(100) NOT NULL,
    `takecare_sname` VARCHAR(100) NOT NULL,
    `takecare_birthday` DATE NOT NULL,
    `gender_id` INTEGER NOT NULL,
    `marry_id` INTEGER NOT NULL,
    `takecare_number` VARCHAR(10) NULL,
    `takecare_moo` VARCHAR(5) NULL,
    `takecare_road` VARCHAR(200) NULL,
    `takecare_tubon` VARCHAR(100) NULL,
    `takecare_amphur` VARCHAR(100) NULL,
    `takecare_province` VARCHAR(100) NULL,
    `takecare_postcode` VARCHAR(5) NULL,
    `takecare_tel1` VARCHAR(12) NULL,
    `takecare_disease` VARCHAR(300) NULL,
    `takecare_drug` VARCHAR(300) NULL,
    `takecare_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`takecare_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `safezone` (
    `takecare_id` INTEGER NOT NULL,
    `users_id` INTEGER NOT NULL,
    `safezone_id` INTEGER NOT NULL AUTO_INCREMENT,
    `safez_latitude` VARCHAR(255) NOT NULL DEFAULT '0',
    `safez_longitude` VARCHAR(255) NOT NULL DEFAULT '0',
    `safez_radiuslv1` INTEGER NOT NULL DEFAULT 0,
    `safez_radiuslv2` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`safezone_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `users_id` INTEGER NOT NULL,
    `takecare_id` INTEGER NOT NULL,
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `locat_timestamp` DATE NOT NULL,
    `locat_latitude` VARCHAR(255) NOT NULL DEFAULT '0',
    `locat_longitude` VARCHAR(255) NOT NULL DEFAULT '0',
    `locat_status` INTEGER NOT NULL DEFAULT 1,
    `locat_distance` INTEGER NOT NULL DEFAULT 0,
    `locat_battery` INTEGER NOT NULL DEFAULT 0,
    `locat_noti_time` DATETIME(3) NULL,
    `locat_noti_status` INTEGER NULL,

    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dlocation` (
    `dlocation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_id` INTEGER NOT NULL,
    `locat_battery` INTEGER NOT NULL,
    `locat_distance` INTEGER NOT NULL,
    `locat_status` INTEGER NOT NULL,
    `locat_longitude` VARCHAR(191) NOT NULL,
    `locat_latitude` VARCHAR(191) NOT NULL,
    `locat_timestamp` DATETIME(3) NOT NULL,
    `location_id` INTEGER NOT NULL,
    `takecare_id` INTEGER NOT NULL,

    PRIMARY KEY (`dlocation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extendedhelp` (
    `exten_id` INTEGER NOT NULL AUTO_INCREMENT,
    `exten_date` DATE NOT NULL,
    `user_id` INTEGER NULL,
    `takecare_id` INTEGER NULL,
    `exten_latitude` VARCHAR(255) NULL,
    `exten_longitude` VARCHAR(255) NULL,
    `exten_received_date` DATETIME(3) NULL,
    `exten_received_user_id` INTEGER NULL,
    `exted_closed_date` DATETIME(3) NULL,
    `exten_closed_user_id` INTEGER NULL,

    PRIMARY KEY (`exten_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groupLine` (
    `group_id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_name` VARCHAR(100) NULL,
    `group_line_id` VARCHAR(100) NOT NULL,
    `group_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `borrowequipment` (
    `borrow_id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrow_date` DATE NOT NULL,
    `borrow_return` DATETIME(3) NULL,
    `borrow_status` INTEGER NOT NULL DEFAULT 1,
    `borrow_user_id` INTEGER NOT NULL,
    `borrow_address` TEXT NOT NULL,
    `borrow_tel` VARCHAR(12) NOT NULL,
    `borrow_objective` TEXT NOT NULL,
    `borrow_name` VARCHAR(255) NOT NULL,
    `borrow_equipment_status` INTEGER NOT NULL DEFAULT 1,
    `borrow_create_date` DATE NOT NULL,
    `borrow_update_date` DATE NOT NULL,
    `borrow_update_user_id` INTEGER NOT NULL,
    `borrow_delete_date` DATETIME(3) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `borrow_approver` INTEGER NULL,
    `borrow_approver_date` DATETIME(3) NULL,
    `borrow_return_user_id` INTEGER NULL,
    `borrow_return_date` DATETIME(3) NULL,
    `borrow_send_date` DATETIME(3) NULL,
    `borrow_send_return` DATETIME(3) NULL,
    `borrow_send_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`borrow_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `borrowequipment_list` (
    `borrow_id` INTEGER NOT NULL,
    `borrow_equipment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrow_equipment` VARCHAR(255) NOT NULL,
    `borrow_equipment_number` VARCHAR(255) NOT NULL,
    `borrow_equipment_status` INTEGER NOT NULL DEFAULT 1,
    `borrow_equipment_delete` DATETIME(3) NULL,

    PRIMARY KEY (`borrow_equipment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `status`(`status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `takecareperson` ADD CONSTRAINT `takecareperson_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`users_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `takecareperson` ADD CONSTRAINT `takecareperson_gender_id_fkey` FOREIGN KEY (`gender_id`) REFERENCES `gender`(`gender_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `takecareperson` ADD CONSTRAINT `takecareperson_marry_id_fkey` FOREIGN KEY (`marry_id`) REFERENCES `marrystatus`(`marry_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `safezone` ADD CONSTRAINT `safezone_takecare_id_fkey` FOREIGN KEY (`takecare_id`) REFERENCES `takecareperson`(`takecare_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `safezone` ADD CONSTRAINT `safezone_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`users_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`users_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_takecare_id_fkey` FOREIGN KEY (`takecare_id`) REFERENCES `takecareperson`(`takecare_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowequipment` ADD CONSTRAINT `borrowequipment_borrow_user_id_fkey` FOREIGN KEY (`borrow_user_id`) REFERENCES `users`(`users_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowequipment` ADD CONSTRAINT `borrowequipment_borrow_approver_fkey` FOREIGN KEY (`borrow_approver`) REFERENCES `users`(`users_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowequipment` ADD CONSTRAINT `borrowequipment_borrow_return_user_id_fkey` FOREIGN KEY (`borrow_return_user_id`) REFERENCES `users`(`users_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowequipment_list` ADD CONSTRAINT `borrowequipment_list_borrow_id_fkey` FOREIGN KEY (`borrow_id`) REFERENCES `borrowequipment`(`borrow_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
