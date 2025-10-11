const { Builder, By, until} = require('selenium-webdriver');


(async function loginTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to the login page
        await driver.get('http://localhost:3000/login');

        //fill in the username and password fields
        await driver.findElement(By.name('email')).sendKeys('577843@student.belgiumcampus.ac.za');
        await driver.findElement(By.name('password')).sendKeys('testpassword');
        
        // Submit the login form
        await driver.findElement(By.css('button[type="submit"]')).click();

       // Wait for welcome message to appear
        await driver.wait(until.elementLocated(By.id('welcomeMessage')), 5000);

        // Confirm login success
        let message = await driver.findElement(By.id('welcomeMessage')).getText();
        console.log('Login successful:', message);
        
    }
    catch (error) {
        console.error('Test failed:', err);
    } finally {
        await driver.quit();
    }


})();