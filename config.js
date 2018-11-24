/*
* This is a environment config. It can be used to vary different app settings for a given environment.
*/

var environments = {};

// Staging environment settings (default)
environments.staging = {
    'httpPort': 3000,
    'environmentName': 'staging'
};

// Production environment settings
environments.production = {
    'httpPort': 5000,
    'environmentName': 'production'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check to see if the environment given is one that exists if so export that environment, or default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;