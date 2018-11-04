<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use GuzzleHttp;

/**
 * @Route(name="default_")
 */
class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function indexAction()
    {
        $initialState  = [];
        $initialConfig = [];

        return $this->render('default/index.html.twig', [
            'initialState'  => json_encode($initialState, JSON_FORCE_OBJECT),
            'initialConfig' => json_encode($initialConfig, JSON_FORCE_OBJECT)
        ]);
    }

    /**
     * @Route("/proxy", name="proxy")
     *
     * @param Request $request
     * @return Response
     */
    public function proxyAction(Request $request)
    {
        $content = json_decode($request->getContent(), true);

        $params = [];
        if ($content['method'] === 'POST') {
            $params['form_params'] = $content['body'];
        }
        $client = new GuzzleHttp\Client();
        $res = $client->request($content['method'], $content['url'], $params);

        $headers = [];
        foreach($res->getHeaders() as $name => $values) {
            $headers[$name] = $values[0];
        }

        return new Response(
            (string)$res->getBody(),
            $res->getStatusCode(),
            $headers
        );
    }
}
