<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
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
     * @Route("", name="submit", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function submitAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'ActionType',
            'RefID',
            'Content',
            'IsAnonymous'
        ]);

        return $anomo->post('comment', [
            'refID'      => $body['RefID'],
            'actionType' => $body['ActionType']
        ], [
            'Content'     => $body['Content'],
            'IsAnonymous' => $body['IsAnonymous']
        ]);
    }

    /**
     * @Route("/{commentID}/{actionType}/likes", name="like", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param int $commentID
     * @param int $actionType
     * @return array
     */
    public function likeAction(Anomo $anomo, $commentID, $actionType)
    {
        return $anomo->get('commentLike', [
            'commentID'  => $commentID,
            'actionType' => $actionType
        ]);
    }
}
