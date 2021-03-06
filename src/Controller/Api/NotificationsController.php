<?php
namespace App\Controller\Api;

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
     * @Route("", name="fetch", methods={"GET"})
     *
     * @param Request $request
     * @return array
     */
    public function fetchAction(Request $request)
    {
        return $this->anomo->get('notificationsHistory', [
            'status' => 1,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/history", name="history", methods={"GET"})
     *
     * @param Request $request
     * @return array
     */
    public function historyAction(Request $request)
    {
        return $this->anomo->get('notificationsHistory', [
            'status' => 2,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("", name="delete_all", methods={"DELETE"})
     *
     * @param Request $request
     * @return array
     */
    public function deleteAllAction(Request $request)
    {
        return $this->anomo->get('notificationsHistory', [
            'status' => 0,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/{notificationID}", name="delete", methods={"DELETE"})
     *
     * @param int $notificationID
     * @return array
     */
    public function deleteAction($notificationID)
    {
        return $this->anomo->get('notificationsRead', [
            'notificationID' => $notificationID
        ]);
    }
}
