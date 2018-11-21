<?php
namespace App\Http\Exception;

/**
 * Class BadRequestException
 */
class BadRequestException extends HttpException
{
    /**
     * Constructor
     *
     * @param string          $message
     * @param \Exception|null $previous
     */
    public function __construct(string $message = 'Bad Request.', \Exception $previous = null)
    {
        parent::__construct($message, 400, $previous);
    }
}
