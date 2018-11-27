<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181127204751 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE activity (id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, user_id BIGINT UNSIGNED DEFAULT NULL, anomo_id BIGINT UNSIGNED NOT NULL, ref_id BIGINT UNSIGNED NOT NULL, action_type SMALLINT UNSIGNED NOT NULL, type SMALLINT UNSIGNED NOT NULL, image VARCHAR(255) NOT NULL, image_height SMALLINT UNSIGNED NOT NULL, image_width SMALLINT UNSIGNED NOT NULL, video_url VARCHAR(255) NOT NULL, video_id VARCHAR(60) NOT NULL, video_source VARCHAR(60) NOT NULL, num_likes SMALLINT UNSIGNED NOT NULL, num_comments SMALLINT UNSIGNED NOT NULL, message VARCHAR(520) NOT NULL, tags VARCHAR(255) NOT NULL, date_created DATETIME NOT NULL, INDEX IDX_AC74095AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE poll_answer (id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, poll_id BIGINT UNSIGNED DEFAULT NULL, anomo_id BIGINT UNSIGNED NOT NULL, answer VARCHAR(255) NOT NULL, percent NUMERIC(4, 2) NOT NULL, num_votes SMALLINT UNSIGNED NOT NULL, date_created DATETIME NOT NULL, INDEX IDX_36D8097E3C947C0F (poll_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, anomo_id BIGINT UNSIGNED NOT NULL, username VARCHAR(60) NOT NULL, avatar VARCHAR(255) NOT NULL, gender SMALLINT UNSIGNED NOT NULL, date_birth DATETIME NOT NULL, neighborhood_id INT UNSIGNED NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE poll (id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, activity_id BIGINT UNSIGNED DEFAULT NULL, anomo_id BIGINT UNSIGNED NOT NULL, question VARCHAR(520) NOT NULL, date_created DATETIME NOT NULL, UNIQUE INDEX UNIQ_84BCFA4581C06096 (activity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE activity ADD CONSTRAINT FK_AC74095AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE poll_answer ADD CONSTRAINT FK_36D8097E3C947C0F FOREIGN KEY (poll_id) REFERENCES poll (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE poll ADD CONSTRAINT FK_84BCFA4581C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE poll DROP FOREIGN KEY FK_84BCFA4581C06096');
        $this->addSql('ALTER TABLE activity DROP FOREIGN KEY FK_AC74095AA76ED395');
        $this->addSql('ALTER TABLE poll_answer DROP FOREIGN KEY FK_36D8097E3C947C0F');
        $this->addSql('DROP TABLE activity');
        $this->addSql('DROP TABLE poll_answer');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE poll');
    }
}
