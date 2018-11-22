<?php
namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

/**
 * Class ApiResponseListener
 */
class ApiResponseListener
{
    /**
     * @param GetResponseForControllerResultEvent $event
     */
    public function onKernelView(GetResponseForControllerResultEvent $event)
    {
        $request = $event->getRequest();
        $result  = $event->getControllerResult();
        if (!($result instanceof Response) && strpos($request->attributes->get('_route'), 'api_') === 0) {
            $event->setResponse(new JsonResponse($result));
        }
    }
}
