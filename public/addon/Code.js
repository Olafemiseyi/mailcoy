/**
 * LightOrb Connect — Google Workspace Add-on (Apps Script Engine)
 * Runs natively in Gmail sidebar for desktop web, Android, and iOS.
 */

const API_BASE = "https://connect.lightorb.com/api";

/**
 * Triggered when user opens Gmail homepage with sidebar opened
 */
function onGmailHomepage(e) {
  var card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader()
    .setTitle("LightOrb Connect")
    .setSubtitle("Professional Identity Manager")
    .setImageStyle(CardService.ImageStyle.SQUARE)
    .setImageUrl("https://raw.githubusercontent.com/lightorb/assets/main/logo-32.png")
  );

  var section = CardService.newCardSection();
  section.setHeader("Active Professional Email");
  
  var textParagraph = CardService.newTextParagraph()
    .setText("You are connected to LightOrb Connect. All emails sent using your send-as alias will be routed with SPF, DKIM, and DMARC alignment.");
  section.addWidget(textParagraph);

  var openButton = CardService.newTextButton()
    .setText("Open Workspace Dashboard")
    .setOpenLink(CardService.newOpenLink().setUrl("https://connect.lightorb.com/dashboard"));
  section.addWidget(openButton);

  card.addSection(section);
  return card.build();
}

/**
 * Triggered contextually when viewing a specific email thread in Gmail
 */
function onGmailMessageOpen(e) {
  var messageId = e.gmail.messageId;
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader()
    .setTitle("Reply-As Professional Address")
    .setSubtitle("LightOrb Routing Shield Active")
  );

  var section = CardService.newCardSection();
  section.addWidget(CardService.newTextParagraph()
    .setText("Select your professional sender alias to reply in-thread with verified corporate headers.")
  );

  var action = CardService.newAction().setFunctionName("onSelectReplyAs");
  var button = CardService.newTextButton()
    .setText("Insert Verified Signature")
    .setOnClickAction(action);
  section.addWidget(button);

  card.addSection(section);
  return card.build();
}

/**
 * Action to insert corporate signature in compose window
 */
function insertLightOrbSignature(e) {
  var response = CardService.newUpdateDraftActionResponseBuilder()
    .setUpdateDraftBodyAction(
      CardService.newUpdateDraftBodyAction()
        .addUpdateContent(
          "<br><br><div style='font-family: sans-serif; font-size: 13px; color: #333;'>--<br><strong>Sent via LightOrb Connect</strong></div>",
          CardService.ContentType.MUTABLE_HTML
        )
        .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT)
    )
    .build();

  return response;
}
