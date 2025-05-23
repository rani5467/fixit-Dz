<?php
// تفعيل عرض الأخطاء لأغراض التطوير فقط (احذفها أو علّقها في البيئة الإنتاجية)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// تعيين رؤوس الاستجابة للسماح بطلبات AJAX من أي مصدر (للتطوير المحلي)
// في البيئة الإنتاجية، يجب تحديد المصدر المسموح به بدلاً من '*'
header("Access-Control-Allow-Origin: *"); //  مهم إذا كان ملف PHP وملف HTML على نطاقات مختلفة
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// التأكد من أن الطلب هو POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // استقبال البيانات الخام من الطلب (أفضل عند إرسال JSON من JavaScript)
    // $data = json_decode(file_get_contents("php://input"));

    // أو استقبال البيانات من النموذج التقليدي (إذا لم يتم إرسالها كـ JSON)
    // في هذه الحالة، سنفترض أن JavaScript يرسل FormData أو أن النموذج يرسل تقليدياً.
    // إذا كان JavaScript يرسل JSON، استخدم الطريقة الأولى (json_decode) وعدّل JavaScript.

    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : "غير متوفر";
    $email_address = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "غير متوفر";
    $service = isset($_POST["service"]) && $_POST["service"] !== "" ? strip_tags(trim($_POST["service"])) : "غير محدد";
    $message_text = isset($_POST["message"]) ? strip_tags(trim($_POST["message"])) : "لا يوجد نص رسالة.";

    // التحقق من الحقول المطلوبة
    if (empty($name) || $name === "غير متوفر" || empty($email_address) || $email_address === "غير متوفر" || !filter_var($email_address, FILTER_VALIDATE_EMAIL) || empty($message_text) || $message_text === "لا يوجد نص رسالة.") {
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "خطأ: الرجاء ملء جميع الحقول المطلوبة بشكل صحيح."]);
        exit;
    }

    // عنوان البريد الإلكتروني الذي ستستقبل عليه الرسائل
    $recipient = "sitayebtoufik0@gmail.com";
    $subject = "طلب خدمة جديد من موقع Fixit Dz من: " . $name;

    // بناء محتوى البريد الإلكتروني بتنسيق HTML (من اليمين لليسار للغة العربية)
    $email_body = "<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>";
    $email_body .= "<div style='max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;'>";
    $email_body .= "<h2 style='color: #1f3c88; border-bottom: 2px solid #ff7f11; padding-bottom: 10px;'>طلب خدمة جديد من موقع Fixit Dz</h2>";
    
    $email_body .= "<table style='width: 100%; border-collapse: collapse;'>";
    $email_body .= "<tr><td style='padding: 8px; border-bottom: 1px solid #eee; background-color: #f0f5ff; font-weight: bold; width: 120px;'>الاسم:</td><td style='padding: 8px; border-bottom: 1px solid #eee;'>" . htmlspecialchars($name) . "</td></tr>";
    $email_body .= "<tr><td style='padding: 8px; border-bottom: 1px solid #eee; background-color: #f0f5ff; font-weight: bold;'>البريد الإلكتروني:</td><td style='padding: 8px; border-bottom: 1px solid #eee;'><a href='mailto:" . htmlspecialchars($email_address) . "'>" . htmlspecialchars($email_address) . "</a></td></tr>";
    $email_body .= "<tr><td style='padding: 8px; border-bottom: 1px solid #eee; background-color: #f0f5ff; font-weight: bold;'>الخدمة المطلوبة:</td><td style='padding: 8px; border-bottom: 1px solid #eee;'>" . htmlspecialchars($service) . "</td></tr>";
    $email_body .= "</table>";

    $email_body .= "<h3 style='color: #1f3c88; margin-top: 20px;'>نص الرسالة:</h3>";
    $email_body .= "<div style='border: 1px solid #e0e0e0; padding: 15px; background-color: #ffffff; border-radius: 5px; min-height: 100px; white-space: pre-wrap; line-height: 1.6;'>";
    $email_body .= nl2br(htmlspecialchars($message_text)); // nl2br للحفاظ على فواصل الأسطر
    $email_body .= "</div>";

    $email_body .= "<p style='margin-top: 30px; font-size: 0.9em; color: #7f8c8d; text-align: center;'>تم إرسال هذه الرسالة من نموذج الاتصال بموقع Fixit Dz بتاريخ: " . date("Y-m-d H:i:s") . "</p>";
    $email_body .= "</div>";
    $email_body .= "</body></html>";

    // تعيين رؤوس البريد لإرسال HTML
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    // استخدم عنوان بريد إلكتروني موجود على نطاق الخادم الخاص بك كمرسل لتجنب مشاكل السمعة (Spam)
    // إذا كان الخادم يسمح بذلك، وإلا استخدم عنوان افتراضي.
    $server_email = "noreply@" . (isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'fixit.dz');
    $headers .= "From: Fixit Dz <" . $server_email . ">" . "\r\n";
    $headers .= "Reply-To: " . htmlspecialchars($name) . " <" . htmlspecialchars($email_address) . ">" . "\r\n";
    // $headers .= "X-Mailer: PHP/" . phpversion(); // اختياري

    // محاولة إرسال البريد
    if (mail($recipient, $subject, $email_body, $headers)) {
        http_response_code(200); // OK
        echo json_encode(["status" => "success", "message" => "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً."]);
    } else {
        http_response_code(500); // Internal Server Error
        // محاولة طباعة خطأ دالة mail (قد لا تعمل على كل الخوادم)
        $last_error = error_get_last();
        $error_message = "عذراً، حدث خطأ أثناء محاولة إرسال الرسالة.";
        if ($last_error !== null && isset($last_error['message'])) {
            $error_message .= " (خطأ الخادم: " . $last_error['message'] . ")";
        }
        echo json_encode(["status" => "error", "message" => $error_message]);
    }

} else {
    // إذا لم يكن الطلب POST
    http_response_code(405); // Method Not Allowed
    echo json_encode(["status" => "error", "message" => "خطأ: طريقة الطلب غير مسموح بها."]);
}
?>
