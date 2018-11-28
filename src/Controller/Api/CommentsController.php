<?php
namespace App\Controller\Api;

use App\Http\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/comments",
 *     name="api_comments_",
 *     options={"expose"=true},
 *     requirements={"commentID": "\d+", "actionType": "\d+"}
 * )
 */
class CommentsController extends Controller
{
    /**
     * @Route("", name="submit", methods={"POST"})
     *
     * @param Request $request
     * @return array
     */
    public function submitAction(Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'ActionType',
            'RefID',
            'Content',
            'IsAnonymous'
        ]);

        return $this->anomo->post('comment', [
            'refID'      => $body['RefID'],
            'actionType' => $body['ActionType']
        ], [
            'Content'     => $body['Content'],
            'IsAnonymous' => $body['IsAnonymous']
        ]);
    }

    /**
     * @Route("/{commentID}", name="delete", methods={"DELETE"})
     *
     * @param int $commentID
     * @return array
     */
    public function deleteAction($commentID)
    {
        return $this->anomo->get('commentDelete', [
            'commentID'  => $commentID
        ]);
    }

    /**
     * @Route("/{commentID}/{actionType}/likes", name="likes", methods={"GET"})
     *
     * @param int $commentID
     * @param int $actionType
     * @return array
     */
    public function likesAction($commentID, $actionType)
    {
        return $this->anomo->get('commentLikeList', [
            'commentID'  => $commentID,
            'actionType' => $actionType
        ]);
    }

    /**
     * @Route("/{commentID}/{actionType}/likes", name="like", methods={"PUT"})
     *
     * @param int $commentID
     * @param int $actionType
     * @return array
     */
    public function likeAction($commentID, $actionType)
    {
        return $this->anomo->get('commentLike', [
            'commentID'  => $commentID,
            'actionType' => $actionType
        ]);
    }
}
