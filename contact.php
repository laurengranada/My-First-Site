<!DOCTYPE html>
<html>
<head>
 <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="HandheldFriendly" content="true">
 <link rel="stylesheet" href="css/film.css"/>
<link rel="stylesheet" href="css/responsive.css"/>
 </head>
<body>

<ul>
<li><a href="index.html">HOME</a></li>
<li><a href="film.html">PORTFOLIO</a></li>
<li><a href="resume.html">RESUME</a></li>
<li><a href="contact.php">CONTACT</a></li>
</ul>

  <div class="name">
    <h1>Contact Me</h1>
    <h4>Let's stay in touch</h4>
  </div>

  <div class="About">

  <?php
     
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];
       $from = 'From: laurengranada.com'; 
        $to = 'laurengranada@utexas.edu'; 
        $subject = 'New message from laurengranada.com';
      
      $body = "From: $name\n E-Mail: $email\n Message:\n $message";
  ?>
      <div class="input-group">
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
          <input type="text" class="form-control" name="name" placeholder="Name" aria-describedby="basic-addon1">
          <input type="email" class="form-control" name="email" placeholder="Email" aria-describedby="basic-addon1">
          <textarea type="text" class="form-control texthere" name="message" placeholder="Message" rows="7" aria-describedby="basic-addon1"></textarea>
          <button type="submit" id="submit" name="submit" class="btn btn-primary" value="submit">Submit</button>
        </form>
    </div>
  </div>

<footer> 
<p>Design by Lauren Granada 2016</p>
</footer>
</body>
</html>