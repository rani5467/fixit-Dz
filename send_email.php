<?php
// Set the content type to application/json for AJAX requests and specify UTF-8
header('Content-Type: application/json; charset=utf-8');

// --- Configuration ---
$recipient_email = "sitayebtoufik0@gmail.com"; // The email address where you want to receive messages
$email_subject_prefix = "[Fixit Dz Contact Form]"; // Prefix for the email subject

// --- Error Reporting (Enable for debugging, disable for production) ---
// error_reporting(E_ALL);
// ini_set('display_errors', 1); // Uncomment these two lines if you need to debug PHP errors

// --- Check if the form was submitted via POST ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Get and Sanitize Form Data ---
    // htmlspecialchars is used to prevent XSS attacks
    // trim removes whitespace from the beginning and end of the string
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8')) : '';
    $email_from = isset($_POST['email']) ? trim($_POST['email']) : ''; // User's email
    $service = isset($_POST['service']) ? trim(htmlspecialchars($_POST['service'], ENT_QUOTES, 'UTF-8')) : 'N/A';
    $message_body = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8')) : '';

    // --- Basic Validation ---
    if (empty($name)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال الاسم الكامل.']);
        exit;
    }
    if (empty($email_from)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال عنوان بريدك الإلكتروني.']);
        exit;
    }
    if (!filter_var($email_from, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال عنوان بريد إلكتروني صالح.']);
        exit;
    }
    if (empty($message_body)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء كتابة رسالتك أو وصف المشكلة.']);
        exit;
    }

    // --- Construct Email ---
    $subject = $email_subject_prefix . " رسالة جديدة من " . $name;

    // Prepare email content
    $email_content = "لقد تلقيت رسالة جديدة من نموذج الاتصال بموقع Fixit Dz:\n\n";
    $email_content .= "الاسم (Name): " . $name . "\n";
    $email_content .= "البريد الإلكتروني (Email): " . $email_from . "\n";
    $email_content .= "الخدمة المطلوبة (Service Requested): " . $service . "\n\n";
    $email_content .= "الرسالة (Message):\n" . $message_body . "\n\n";
    $email_content .= "-------------------------------------\n";
    $email_content .= "تم إرسال هذه الرسالة من نموذج الاتصال على موقع الويب الخاص بك.";

    // Email Headers
    // Using a no-reply address from your domain for the "From" header is often better for deliverability.
    // The user's email goes into "Reply-To".
    // Replace 'yourdomain.com' with your actual domain if you have one, or use a generic sender if necessary.
    $headers = "From: Fixit Dz <noreply@yourdomain.com>\r\n"; // Replace yourdomain.com with your actual domain if possible
    $headers .= "Reply-To: " . $email_from . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // --- Send Email ---
    // The mb_encode_mimeheader is important for UTF-8 subjects in some mail clients
    if (mail($recipient_email, "=?UTF-8?B?".base64_encode($subject)."?=", $email_content, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً.']);
    } else {
        // Log the error for server-side debugging (check your server's error logs)
        error_log("PHP mail() failed for: " . $recipient_email . " from " . $email_from . ". Subject: " . $subject);
        // Provide a generic error to the user for security and simplicity
        echo json_encode(['status' => 'error', 'message' => 'عذرًا، حدث خطأ أثناء محاولة إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقًا أو التواصل معنا بطريقة أخرى.']);
    }

} else {
    // Not a POST request, forbid access
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'طريقة الطلب غير صالحة.']);
}
?>
