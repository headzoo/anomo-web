<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use App\Http\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/users",
 *     name="api_users_",
 *     options={"expose"=true},
 *     requirements={"userID": "\d+"}
 * )
 */
class UsersController extends Controller
{
    /**
     * @Route("/{userID}", name="fetch", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function fetchAction(Anomo $anomo, $userID)
    {
        return $anomo->get('user', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/{userID}", name="update", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function updateAction(Anomo $anomo, Request $request)
    {
        return $anomo->post('userUpdate', [], $request->json->all());
    }

    /**
     * @Route("/{userID}/password", name="password", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function passwordAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'OldPassword',
            'NewPassword'
        ]);

        return $anomo->post('userUpdatePassword', [], [
            'OldPassword' => md5($body['OldPassword']),
            'NewPassword' => md5($body['NewPassword'])
        ]);
    }

    /**
     * @Route("/{userID}/privacy", name="privacy", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function privacyAction(Anomo $anomo, Request $request)
    {
        return $anomo->post('userUpdatePrivacy', [], $request->json->all());
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function loginAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'UserName',
            'Password'
        ]);

        return $anomo->post('userLogin', [], [
            'UserName' => $body['UserName'],
            'Password' => md5($body['Password'])
        ]);
    }

    /**
     * @Route("/login/facebook", name="login_facebook", methods={"POST"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function facebookLoginAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'Email',
            'FacebookID',
            'FbAccessToken'
        ]);

        return $anomo->post('userFBLogin', [], $body);
    }

    /**
     * @Route("/logout", name="logout", methods={"POST"})
     *
     * @param Anomo $anomo
     * @return array
     */
    public function logoutAction(Anomo $anomo)
    {
        return $anomo->post('userLogout');
    }

    /**
     * @Route("/{userID}/following", name="following", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @param int $userID
     * @return array
     */
    public function followingAction(Anomo $anomo, Request $request, $userID)
    {
        return $anomo->get('userFollowing', [
            'userID' => $userID,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/{userID}/followers", name="followers", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @param int $userID
     * @return array
     */
    public function followersAction(Anomo $anomo, Request $request, $userID)
    {
        return $anomo->get('userFollowers', [
            'userID' => $userID,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/{userID}/followers", name="follow", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function followAction(Anomo $anomo, $userID)
    {
        return $anomo->get('userFollow', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/{userID}/blocked", name="blocked", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @return array
     */
    public function blockedAction(Anomo $anomo, $userID)
    {
        return $anomo->get('userBlocked', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/{userID}/blocked", name="block", methods={"PUT"})
     *
     * @param Anomo $anomo
     * @param Request $request
     * @return array
     */
    public function blockAction(Anomo $anomo, Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'userID'
        ]);

        return $anomo->post('userBlock', [], $body);
    }
}
