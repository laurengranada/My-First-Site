<!DOCTYPE html>
<html>
<head>
 <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	  <meta name="HandheldFriendly" content="true">
 <link rel="stylesheet" href="css/contact.css"/>
<link rel="stylesheet" href="css/responsive.css"/>
 </head>
<body>
<h1>Contact me:</h1>
	<ul>
    	<li><a href="index.html">HOME</a></li>
        <li><a href="film.html">PORTFOLIO</a></li>
        <li><a href="resume.html">RESUME</a></li>
        <li><a href="contact.php">CONTACT</a></li>
	</ul>  
    
    
<?php
 
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
	 $from = 'From: laurengranada.com'; 
    $to = 'laurengranada@utexas.edu'; 
    $subject = 'New message from laurengranada.com';
	
	$body = "From: $name\n E-Mail: $email\n Message:\n $message";
	
?>

<section>

<?php
if ($_POST['submit']) {
    if ($name != '' && $email != '') {			 
            if (mail ($to, $subject, $body, $from)) { 
	        echo '<p>Your message has been sent!</p>';
	    } else { 
	        echo '<p>Something went wrong, go back and try again!</p>'; 
	}
    } else {
        echo '<p>You need to fill in all required fields!!</p>';
    }
}
?>

	<form method="post" action="contact.php">
    	<label>Name*:</label>
        	<input name="name" placeholder="Type Here">
        
        <label>Email*:</label>
        	<input name="email" type="email" placeholder="Type Here">
        
        <label>Message:</label>
        	<textarea name="message" placeholder="Type Here"></textarea>
            <input id="submit" name="submit" type="submit" value="Submit">
        
    </form>
</section>


</body>
</html>

<footer> 
<p>Design by Lauren Granada 2016</p>
</footer>
