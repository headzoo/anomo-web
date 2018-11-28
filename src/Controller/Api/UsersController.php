<?php
namespace App\Controller\Api;

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
     * @param int $userID
     * @return array
     */
    public function fetchAction($userID)
    {
        return $this->anomo->get('user', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/{userID}", name="update", methods={"POST"})
     *
     * @param Request $request
     * @return array
     */
    public function updateAction(Request $request)
    {
        return $this->anomo->post('userUpdate', [], $request->json->all());
    }

    /**
     * @Route("/{userID}/password", name="password", methods={"POST"})
     *
     * @param Request $request
     * @return array
     */
    public function passwordAction(Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'OldPassword',
            'NewPassword'
        ]);

        return $this->anomo->post('userUpdatePassword', [], [
            'OldPassword' => md5($body['OldPassword']),
            'NewPassword' => md5($body['NewPassword'])
        ]);
    }

    /**
     * @Route("/{userID}/privacy", name="privacy", methods={"POST"})
     *
     * @param Request $request
     * @return array
     */
    public function privacyAction(Request $request)
    {
        return $this->anomo->post('userUpdatePrivacy', [], $request->json->all());
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     *
     * @param Request $request
     * @return array
     */
    public function loginAction(Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'UserName',
            'Password'
        ]);

        return $this->anomo->post('userLogin', [], [
            'UserName' => $body['UserName'],
            'Password' => md5($body['Password'])
        ]);
    }

    /**
     * @Route("/login/facebook", name="login_facebook", methods={"POST"})
     *
     * @param Request $request
     * @return array
     */
    public function facebookLoginAction(Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'Email',
            'FacebookID',
            'FbAccessToken'
        ]);

        return $this->anomo->post('userFBLogin', [], $body);
    }

    /**
     * @Route("/logout", name="logout", methods={"POST"})
     *
     * @return array
     */
    public function logoutAction()
    {
        return $this->anomo->post('userLogout');
    }

    /**
     * @Route("/{userID}/following", name="following", methods={"GET"})
     *
     * @param Request $request
     * @param int $userID
     * @return array
     */
    public function followingAction(Request $request, $userID)
    {
        return $this->anomo->get('userFollowing', [
            'userID' => $userID,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/{userID}/followers", name="followers", methods={"GET"})
     *
     * @param Request $request
     * @param int $userID
     * @return array
     */
    public function followersAction(Request $request, $userID)
    {
        return $this->anomo->get('userFollowers', [
            'userID' => $userID,
            'page'   => $request->query->get('page', 1)
        ]);
    }

    /**
     * @Route("/{userID}/followers", name="follow", methods={"PUT"})
     *
     * @param int $userID
     * @return array
     */
    public function followAction($userID)
    {
        return $this->anomo->get('userFollow', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/{userID}/blocked", name="blocked", methods={"GET"})
     *
     * @param int $userID
     * @return array
     */
    public function blockedAction($userID)
    {
        return $this->anomo->get('userBlocked', [
            'userID' => $userID
        ]);
    }

    /**
     * @Route("/{userID}/blocked", name="block", methods={"PUT"})
     *
     * @param Request $request
     * @return array
     */
    public function blockAction(Request $request)
    {
        $body = $this->getRequired($request->json->all(), [
            'userID'
        ]);

        return $this->anomo->post('userBlock', [], $body);
    }
}
