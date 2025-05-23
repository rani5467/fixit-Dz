<?php
// Set the content type to application/json for AJAX requests
header('Content-Type: application/json; charset=utf-8');

// --- Configuration ---
$recipient_email = "sitayebtoufik0@gmail.com"; // The email address where you want to receive messages
$email_subject_prefix = "[Fixit Dz Contact Form]"; // Prefix for the email subject

// --- Error Reporting (Enable for debugging, disable for production) ---
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// --- Check if the form was submitted via POST ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Get and Sanitize Form Data ---
    // htmlspecialchars is used to prevent XSS attacks
    // trim removes whitespace from the beginning and end of the string
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $service = isset($_POST['service']) ? trim(htmlspecialchars($_POST['service'])) : 'N/A';
    $message_body = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

    // --- Basic Validation ---
    if (empty($name)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال الاسم الكامل.']);
        exit;
    }
    if (empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال عنوان بريدك الإلكتروني.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال عنوان بريد إلكتروني صالح.']);
        exit;
    }
    if (empty($message_body)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء كتابة رسالتك أو وصف المشكلة.']);
        exit;
    }

    // --- Construct Email ---
    $subject = $email_subject_prefix . " New message from " . $name;

    $email_content = "You have received a new message from your Fixit Dz website contact form:\n\n";
    $email_content .= "Name: " . $name . "\n";
    $email_content .= "Email: " . $email . "\n";
    $email_content .= "Service Requested: " . $service . "\n\n";
    $email_content .= "Message:\n" . $message_body . "\n\n";
    $email_content .= "-------------------------------------\n";
    $email_content .= "This email was sent from the contact form on your website.";

    // Email Headers
    // Using the sender's email in "Reply-To" is good practice.
    // For the "From" header, it's often better to use an email address from your own domain
    // to avoid emails being marked as spam. Some servers might also restrict this.
    // For simplicity, we'll use the sender's email here, but be aware of potential deliverability issues.
    $headers = "From: Fixit Dz Contact <noreply@yourdomain.com>\r\n"; // Replace yourdomain.com with your actual domain
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // --- Send Email ---
    if (mail($recipient_email, $subject, $email_content, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً.']);
    } else {
        // Log the error for server-side debugging
        error_log("PHP mail() failed for: " . $recipient_email . " from " . $email);
        echo json_encode(['status' => 'error', 'message' => 'عذرًا، حدث خطأ أثناء محاولة إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقًا أو التواصل معنا بطريقة أخرى.']);
    }

} else {
    // Not a POST request, forbid access
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
