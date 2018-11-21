<?php
namespace App\Controller\Api;

use App\Http\Exception\BadRequestException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * Class Controller
 */
class Controller extends AbstractController
{
    /**
     * @param string $message
     * @param \Exception|null $previous
     * @return BadRequestException
     */
    public function createBadRequestException(string $message = 'Bad Request.', \Exception $previous = null): BadRequestException
    {
        return new BadRequestException($message, $previous);
    }
}
