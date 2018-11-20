<?php
namespace App\EventListener;

use App\Anomo\Anomo;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;

/**
 * Class ApiRequestListener
 */
class ApiRequestListener
{
    /**
     * @var Anomo
     */
    private $anomo;

    /**
     * Constructor
     *
     * @param Anomo $anomo
     */
    public function __construct(Anomo $anomo)
    {
        $this->anomo = $anomo;
    }

    /**
     * @param GetResponseEvent $event
     */
    public function onKernelRequest(GetResponseEvent $event)
    {
        /** @var \App\Http\Request $request */
        $request = $event->getRequest();
        $token   = $request->token();
        if ($token) {
            $this->anomo->getEndpoints()->setDefaultParam('token', $token);
        }
    }
}
