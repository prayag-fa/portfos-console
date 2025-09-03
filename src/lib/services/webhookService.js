// Webhook service for handling webhook data and operations

export const getWebhookData = (step, accountId = null, userId = null) => {
  return {
    url: 'https://api.example.com/webhook/consent',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token123'
    },
    request: {
      userId: userId,
      step: step.name,
      accountId: accountId,
      timestamp: step.timestamp
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        success: true,
        message: 'Webhook processed successfully',
        data: {
          stepId: step.id,
          accountId: accountId,
          processedAt: step.timestamp
        }
      },
      timestamp: step.timestamp
    }
  };
};
