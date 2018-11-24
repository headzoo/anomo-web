<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use App\Http\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/notifications",
 *     name="api_notifications_",
 *     options={"expose"=true},
 *     requirements={"notificationID": "\d+"}
 * )
 */
class NotificationsController extends Controller
{
    /**
     * @Route("/{status}", name="fetch", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @param int $status
     * @return array
     */
    public function fetchAction(Anomo $anomo, Request $request, $status)
    {
        return $anomo->get('notificationsHistory', [
            'status' => $status,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/{notificationID}", name="delete", methods={"DELETE"})
     *
     * @param Anomo $anomo
     * @param int $notificationID
     * @return array
     */
    public function deleteAction(Anomo $anomo, $notificationID)
    {
        return $anomo->get('notificationsRead', [
            'notificationID' => $notificationID
        ]);
    }
}
