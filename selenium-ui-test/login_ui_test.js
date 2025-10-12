const { Builder, By, until } = require('selenium-webdriver');

(async function loginTests() {
    let driver = await new Builder().forBrowser('chrome').build();

    async function testLogin(email, password, expectedMessage, messageSelector, shouldSucceed = true) {
        await driver.get('http://localhost:3000/login');

        // Clear and fill in the fields
        await driver.findElement(By.name('email')).clear();
        await driver.findElement(By.name('email')).sendKeys(email || '');
        await driver.findElement(By.name('password')).clear();
        await driver.findElement(By.name('password')).sendKeys(password || '');

        await driver.findElement(By.css('button[type="submit"]')).click();

        try {
            await driver.wait(until.elementLocated(By.css(messageSelector)), 5000);
            const message = await driver.findElement(By.css(messageSelector)).getText();
            console.log(`Test ${shouldSucceed ? 'passed' : 'handled'}:`, message);
        } catch (err) {
            console.error(`Test ${shouldSucceed ? 'failed' : 'unexpected'}:`, err);
        }
    }

    try {
        // ✅ Valid campus email
        await testLogin(
            '577843@student.belgiumcampus.ac.za',
            'testpassword',
            'Login successful',
            '#welcomeMessage'
        );

        // ❌ Missing email
        await testLogin(
            '',
            'testpassword',
            'Email is required',
            '#errorMessage',
            false
        );

        // ❌ Missing password
        await testLogin(
            '577843@student.belgiumcampus.ac.za',
            '',
            'Password is required',
            '#errorMessage',
            false
        );

        // ❌ Invalid domain
        await testLogin(
            'user@gmail.com',
            'testpassword',
            'Please use your @belgiumcampus.ac.za email',
            '#errorMessage',
            false
        );

    } finally {
        await driver.quit();
    }
})();
