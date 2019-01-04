<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181204032232 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_tag (id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, user_to_id BIGINT UNSIGNED DEFAULT NULL, user_from_id BIGINT UNSIGNED DEFAULT NULL, tag VARCHAR(60) NOT NULL, date_created DATETIME NOT NULL, INDEX IDX_E89FD608D2F7B13D (user_to_id), INDEX IDX_E89FD60820C3C701 (user_from_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD608D2F7B13D FOREIGN KEY (user_to_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD60820C3C701 FOREIGN KEY (user_from_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE user_tag');
    }
}
