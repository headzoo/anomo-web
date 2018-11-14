<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
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
        $params = [];

        /** @var UploadedFile $photo */
        $photo = $request->files->get('Photo');
        if ($photo) {
            $post = $request->request->all();
            $content = [
                'url'    => $post['url'],
                'method' => $post['method']
            ];
            unset($post['url']);
            unset($post['method']);

            $params['multipart'] = [
                [
                    'name'     => 'Photo',
                    'filename' => $photo->getClientOriginalName(),
                    'contents' => fopen($photo->getPathname(), 'r'),
                    'headers'  => [
                        'Content-Type' => $photo->getClientMimeType()
                    ]
                ]
            ];

            $video = $request->files->get('Video');
            if ($video) {
                $params['multipart'][] = [
                    'name'     => 'Video',
                    'filename' => $video->getClientOriginalName(),
                    'contents' => fopen($video->getPathname(), 'r'),
                    'headers'  => [
                        'Content-Type' => $video->getClientMimeType()
                    ]
                ];
            }

            foreach($post as $name => $contents) {
                $params['multipart'][] = [
                    'name'     => $name,
                    'contents' => $contents
                ];
            }
        } else {
            $content = json_decode($request->getContent(), true);
            if ($content['method'] === 'POST') {
                $params['form_params'] = $content['body'];
            }
        }

        $client   = new GuzzleHttp\Client();
        $response = $client->request($content['method'], $content['url'], $params);

        $headers = [];
        foreach($response->getHeaders() as $name => $values) {
            $headers[$name] = $values[0];
        }

        return new Response(
            (string)$response->getBody(),
            $response->getStatusCode(),
            $headers
        );
    }
}
