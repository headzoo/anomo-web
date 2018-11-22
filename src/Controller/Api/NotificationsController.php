<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/notifications",
 *     name="api_notifications_",
 *     options={"expose"=true},
 *     defaults={"page": 1},
 *     requirements={"notificationID": "\d+", "page": "\d+"}
 * )
 */
class NotificationsController extends Controller
{
    /**
     * @Route("/{status}/{page}", name="fetch", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $status
     * @param int $page
     * @return array
     */
    public function fetchAction(Anomo $anomo, $status, $page)
    {
        return $anomo->get('notificationsHistory', [
            'status' => $status,
            'page'   => $page
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
