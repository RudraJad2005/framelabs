// API Controller - Handles form submissions and API requests

exports.submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and message'
            });
        }

        // TODO: Save to database or send email
        console.log('Contact Form:', { name, email, message });

        res.status(200).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};

exports.subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        // TODO: Save to database
        console.log('Newsletter Subscription:', email);

        res.status(200).json({
            success: true,
            message: 'Successfully subscribed to newsletter!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};

exports.joinWaitlist = async (req, res) => {
    try {
        const { email, name } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        // TODO: Save to database
        console.log('Waitlist:', { email, name });

        res.status(200).json({
            success: true,
            message: 'You have been added to the waitlist!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};
