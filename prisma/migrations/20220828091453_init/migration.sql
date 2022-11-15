-- CreateTable
CREATE TABLE `RefreshTokenStates` (
    `username` VARCHAR(45) NOT NULL,
    `version` INTEGER NOT NULL AUTO_INCREMENT,
    `addedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_refreshTokenStates_1_idx`(`username`),
    PRIMARY KEY (`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `role` VARCHAR(45) NOT NULL,
    `desc` VARCHAR(45) NULL,
    `addedBy` VARCHAR(45) NULL,
    `addedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `username` VARCHAR(45) NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `role` VARCHAR(45) NOT NULL,
    `disabled` BOOLEAN NULL DEFAULT false,
    `addedBy` VARCHAR(45) NULL,
    `email` VARCHAR(60) NULL,
    `phone` VARCHAR(15) NULL,
    `hash` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `username_UNIQUE`(`username`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `phone_UNIQUE`(`phone`),
    INDEX `fk_Users_1_idx`(`role`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshTokenStates` ADD CONSTRAINT `fk_refreshTokenStates_1` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `fk_Users_1` FOREIGN KEY (`role`) REFERENCES `Roles`(`role`) ON DELETE NO ACTION ON UPDATE NO ACTION;
