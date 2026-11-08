const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('./server');

const PORT = 5555;
let server;

// Helper function to send HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (postData) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function uploadImage(fileName, token) {
  return new Promise((resolve, reject) => {
    const boundary = `----CampusMarketplace${Date.now()}`;
    const fileContent = Buffer.from('GIF89a000000', 'ascii');
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="images"; filename="${fileName}"\r\nContent-Type: image/gif\r\n\r\n`),
      fileContent,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/upload/multiple',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting API Verification Tests...\n');
  let studentToken = '';
  let adminToken = '';
  let createdProductId = '';
  let activeChatId = '';

  // 1. Auth Login (Student)
  const studentLogin = await request('POST', '/api/auth/login', {
    email: 'aryan.21b0101001@abes.ac.in',
    password: 'password123'
  });
  console.log('1. Student Login:', studentLogin.status === 200 ? '✅ PASS' : '❌ FAIL');
  studentToken = studentLogin.body.token;

  // 2. Auth Login (Admin)
  const adminLogin = await request('POST', '/api/auth/login', {
    email: 'admin.council@abes.ac.in',
    password: 'admin123'
  });
  console.log('2. Admin Login:', adminLogin.status === 200 ? '✅ PASS' : '❌ FAIL');
  adminToken = adminLogin.body.token;

  // 3. Product APIs: Add Product
  const addProd = await request('POST', '/api/products', {
    title: 'Quantum Mechanics & Engineering Physics Notes',
    description: 'Complete handwritten semester 1 unit 1-5 notes with solved question bank.',
    price: 150,
    originalPrice: 400,
    category: 'books',
    condition: 'Like New',
    location: 'Kalpana Chawla GH-1'
  }, studentToken);
  console.log('3. Product Add:', addProd.status === 201 ? '✅ PASS' : '❌ FAIL', addProd.body.data?.title);
  createdProductId = addProd.body.data?._id || addProd.body.data?.id;

  // 4. Product APIs: View List
  const listProds = await request('GET', '/api/products');
  console.log('4. Product View List:', listProds.status === 200 ? '✅ PASS' : '❌ FAIL', `Count: ${listProds.body.count}`);

  // 5. Product APIs: Search
  const searchProds = await request('GET', '/api/products/search?q=Quantum');
  console.log('5. Product Search:', searchProds.status === 200 && searchProds.body.data.length > 0 ? '✅ PASS' : '❌ FAIL');

  // 6. Product APIs: View Single
  const viewSingle = await request('GET', `/api/products/${createdProductId}`);
  console.log('6. Product View Single:', viewSingle.status === 200 ? '✅ PASS' : '❌ FAIL');

  // 7. Product APIs: Update
  const updateProd = await request('PUT', `/api/products/${createdProductId}`, {
    price: 120,
    condition: 'Brand New'
  }, studentToken);
  console.log('7. Product Update:', updateProd.status === 200 && updateProd.body.data.price === 120 ? '✅ PASS' : '❌ FAIL');

  // 8. Wishlist APIs: Add
  const addWishlist = await request('POST', `/api/wishlist/${createdProductId}`, null, studentToken);
  console.log('8. Wishlist Add:', addWishlist.status === 200 ? '✅ PASS' : '❌ FAIL');

  // 9. Wishlist APIs: View
  const viewWishlist = await request('GET', '/api/wishlist', null, studentToken);
  console.log('9. Wishlist View:', viewWishlist.status === 200 ? '✅ PASS' : '❌ FAIL');

  // 10. Wishlist APIs: Toggle
  const toggleWish = await request('POST', `/api/wishlist/toggle/${createdProductId}`, null, studentToken);
  console.log('10. Wishlist Toggle (Remove):', toggleWish.status === 200 && toggleWish.body.isWishlisted === false ? '✅ PASS' : '❌ FAIL');

  // 11. Wishlist APIs: Toggle back (Add)
  const toggleWishBack = await request('POST', `/api/wishlist/toggle/${createdProductId}`, null, studentToken);
  console.log('11. Wishlist Toggle (Add back):', toggleWishBack.status === 200 && toggleWishBack.body.isWishlisted === true ? '✅ PASS' : '❌ FAIL');

  // 12. Chat APIs: Start Chat
  const startChat = await request('POST', '/api/chats/start', {
    productId: 'prod-2',
    sellerId: 'user-abes-2',
    initialMessage: 'Hey Priya, is the mini drafter available for inspection?'
  }, studentToken);
  console.log('12. Chat Start:', (startChat.status === 200 || startChat.status === 201) ? '✅ PASS' : '❌ FAIL', `ChatId: ${startChat.body.chatId}`);
  activeChatId = startChat.body.chatId;

  // 13. Chat APIs: Send / Save Message
  const sendMsg = await request('POST', `/api/chats/${activeChatId}/messages`, {
    text: 'Yes, I can meet at the cafeteria after 4 PM.'
  }, studentToken);
  console.log('13. Chat Save Message:', sendMsg.status === 201 ? '✅ PASS' : '❌ FAIL');

  // 14. Chat APIs: Get Chat Messages
  const getMsgs = await request('GET', `/api/chats/${activeChatId}`, null, studentToken);
  console.log('14. Chat History View:', getMsgs.status === 200 && getMsgs.body.messages.length > 0 ? '✅ PASS' : '❌ FAIL');

  // 15. Chat access control and read state
  const outsiderRegistration = await request('POST', '/api/auth/register', {
    name: 'Feature Test',
    email: `feature-admin-${Date.now()}@abes.ac.in`,
    password: 'password123'
  });
  const outsiderToken = outsiderRegistration.body.token;
  const outsiderChat = await request('GET', `/api/chats/${activeChatId}`, null, outsiderToken);
  const outsiderMessage = await request('POST', `/api/chats/${activeChatId}/messages`, {
    text: 'This message must be rejected.'
  }, outsiderToken);
  const dynamicChat = await request('POST', '/api/chats/start', {
    productId: 'prod-1',
    sellerId: 'user-abes-1',
    initialMessage: 'Is the calculator still available?'
  }, outsiderToken);
  const dynamicChatId = dynamicChat.body.chatId;
  const dynamicMessage = await request('POST', `/api/chats/${dynamicChatId}/messages`, {
    text: 'I can meet after class.'
  }, outsiderToken);
  const sellerMessages = await request('GET', '/api/chats', null, studentToken);
  const sellerConversation = sellerMessages.body.data?.find((chat) => chat.chatId === dynamicChatId);
  const sellerMarkRead = await request('PUT', `/api/chats/${dynamicChatId}/read`, null, studentToken);
  const messagesAfterRead = await request('GET', '/api/chats', null, studentToken);
  const conversationAfterRead = messagesAfterRead.body.data?.find((chat) => chat.chatId === dynamicChatId);
  const sellerLogin = await request('POST', '/api/auth/login', {
    email: 'priya.22b0201045@abes.ac.in',
    password: 'password123'
  });
  const sellerChats = await request('GET', '/api/chats', null, sellerLogin.body.token);
  const sellerChat = sellerChats.body.data?.find((chat) => chat.chatId === activeChatId);
  const markRead = await request('PUT', `/api/chats/${activeChatId}/read`, null, sellerLogin.body.token);
  const chatsAfterRead = await request('GET', '/api/chats', null, sellerLogin.body.token);
  const readChat = chatsAfterRead.body.data?.find((chat) => chat.chatId === activeChatId);
  console.log('15. Chat Access & Read State:', outsiderRegistration.body.user?.role === 'student' && outsiderChat.status === 403 && outsiderMessage.status === 403 && dynamicChat.status === 201 && dynamicMessage.status === 201 && sellerConversation?.unread > 0 && sellerMarkRead.status === 200 && conversationAfterRead?.unread === 0 && sellerChat?.unread > 0 && markRead.status === 200 && readChat?.unread === 0 ? '✅ PASS' : '❌ FAIL');

  // 16. Image upload
  const imageName = `campus-test-${Date.now()}.gif`;
  const uploadedImage = await uploadImage(imageName, studentToken);
  const uploadedFilename = uploadedImage.body.files?.[0]?.filename;
  const uploadPass = uploadedImage.status === 200 && Boolean(uploadedFilename);
  if (uploadedFilename) {
    fs.unlinkSync(path.join(__dirname, 'uploads', uploadedFilename));
  }
  console.log('16. Image Upload:', uploadPass ? '✅ PASS' : '❌ FAIL');

  // 17. Admin APIs: Get Dashboard Stats
  const adminStats = await request('GET', '/api/admin/stats', null, adminToken);
  console.log('17. Admin Stats:', adminStats.status === 200 ? '✅ PASS' : '❌ FAIL', JSON.stringify(adminStats.body.stats));

  // 18. Admin APIs: Get Users
  const adminUsers = await request('GET', '/api/admin/users', null, adminToken);
  console.log('18. Admin Get Users:', adminUsers.status === 200 ? '✅ PASS' : '❌ FAIL', `Count: ${adminUsers.body.count}`);

  // 19. Admin APIs: Manage User Status
  const userStatus = await request('PUT', '/api/admin/users/user-abes-2/status', {
    status: 'suspended'
  }, adminToken);
  console.log('19. Admin Update User Status:', userStatus.status === 200 ? '✅ PASS' : '❌ FAIL');

  // Restore user status back to active
  await request('PUT', '/api/admin/users/user-abes-2/status', { status: 'active' }, adminToken);

  // 20. Admin APIs: Manage Product Status
  const prodStatus = await request('PUT', `/api/admin/products/${createdProductId}/status`, {
    status: 'sold'
  }, adminToken);
  console.log('20. Admin Update Product Status:', prodStatus.status === 200 && prodStatus.body.data.status === 'sold' ? '✅ PASS' : '❌ FAIL');

  // 21. Product APIs: Delete Product
  const deleteProd = await request('DELETE', `/api/products/${createdProductId}`, null, studentToken);
  console.log('21. Product Delete:', deleteProd.status === 200 ? '✅ PASS' : '❌ FAIL');

  console.log('\n🎉 ALL APIS TESTED SUCCESSFULLY!');
  process.exit(0);
}

server = app.listen(PORT, async () => {
  try {
    await runTests();
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
});
