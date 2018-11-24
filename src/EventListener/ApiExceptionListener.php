<?php
namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;

/**
 * Class ApiExceptionListener
 */
class ApiExceptionListener
{
    /**
     * @param GetResponseForExceptionEvent $event
     */
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();
        $request   = $event->getRequest();

        if (stripos($request->headers->get('Accept'), 'application/json') !== false) {
            $response = new JsonResponse([
                'error' => $exception->getMessage()
            ]);
            $event->setResponse($response);
        }
    }
}
