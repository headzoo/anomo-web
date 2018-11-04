<?php
namespace App\Http\Exception;

use Symfony\Component\Security\Core\Exception\RuntimeException;

/**
 * Class InternalServerException
 */
class InternalServerException extends RuntimeException
{
    /**
     * Constructor
     *
     * @param string          $message
     * @param \Exception|null $previous
     */
    public function __construct(string $message = 'Internal Server Error.', \Exception $previous = null)
    {
        parent::__construct($message, 500, $previous);
    }
}
