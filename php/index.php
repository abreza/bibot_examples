<!DOCTYPE html>
<html>
<head>
    <title>Bibot Example</title>
</head>
<body>
    <form action="" method="POST">
        <div class="bibot-captcha" data-sitekey="yout_site_key"></div>
        <input type="submit" value="Submit">
    </form>
    <script src="https://bibot.ir/bibot.min.js"></script>
</body>
</html>

<?php
if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['bibot-response']) && !empty($_POST['bibot-response']))
{
    $secret_key = 'your_secret_key';
    $data = array('response' => $_POST['bibot-response'], 'secretkey' => $secret_key);
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context  = stream_context_create($options);
    $responseData = json_decode(file_get_contents('https://api.bibot.ir/api1/siteverify/', false, $context));
    if($responseData->success)
    {
        echo 'Your contact request have submitted successfully.';
    }
    else
    {
        echo 'Robot verification failed, please try again.';
    }
}
?>
