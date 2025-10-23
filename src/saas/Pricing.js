import React, { useState } from 'react';
import './Pricing.css';

const Pricing = ({ onSelectPlan }) => {
    const [selectedPlan, setSelectedPlan] = useState('pro');

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            period: 'forever',
            description: 'Perfect for getting started',
            features: [
                '1 Personal Site',
                'Basic Templates',
                'Contact Form',
                'Basic Analytics',
                'Community Support'
            ],
            limitations: [
                'Limited customization',
                'Basic themes only',
                'No custom domain'
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 9,
            period: 'month',
            description: 'Best for professionals',
            features: [
                '5 Personal Sites',
                'Premium Templates',
                'Custom Domain',
                'Advanced Analytics',
                'Priority Support',
                'Email Integration',
                'SEO Tools'
            ],
            limitations: [],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 29,
            period: 'month',
            description: 'For teams and agencies',
            features: [
                'Unlimited Sites',
                'All Premium Templates',
                'Custom Branding',
                'White-label Solution',
                'API Access',
                'Dedicated Support',
                'Team Management'
            ],
            limitations: [],
            popular: false
        }
    ];

    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
        if (onSelectPlan) {
            onSelectPlan(planId);
        }
    };

    const handleSubscribe = async (planId) => {
        try {
            // In production, integrate with Stripe or PayPal
            console.log('Subscribing to plan:', planId);

            // For demo purposes, simulate successful subscription
            alert(`Successfully subscribed to ${plans.find(p => p.id === planId)?.name} plan!`);
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Subscription failed. Please try again.');
        }
    };

    return (
        <div className="pricing-container">
            <div className="pricing-header">
                <h1>Choose Your Plan</h1>
                <p>Select the perfect plan for your needs. You can upgrade or downgrade at any time.</p>
            </div>

            <div className="pricing-grid">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`pricing-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                        onClick={() => handleSelectPlan(plan.id)}
                    >
                        {plan.popular && (
                            <div className="popular-badge">Most Popular</div>
                        )}

                        <div className="plan-header">
                            <h3>{plan.name}</h3>
                            <div className="plan-price">
                                <span className="price">${plan.price}</span>
                                <span className="period">/{plan.period}</span>
                            </div>
                            <p className="plan-description">{plan.description}</p>
                        </div>

                        <div className="plan-features">
                            <h4>What's included:</h4>
                            <ul>
                                {plan.features.map((feature, index) => (
                                    <li key={index}>
                                        <span className="checkmark">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {plan.limitations.length > 0 && (
                                <div className="plan-limitations">
                                    <h4>Limitations:</h4>
                                    <ul>
                                        {plan.limitations.map((limitation, index) => (
                                            <li key={index}>
                                                <span className="crossmark">✗</span>
                                                {limitation}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="plan-actions">
                            {plan.id === 'free' ? (
                                <button
                                    className="plan-button free"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubscribe(plan.id);
                                    }}
                                >
                                    Get Started Free
                                </button>
                            ) : (
                                <button
                                    className="plan-button paid"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubscribe(plan.id);
                                    }}
                                >
                                    Subscribe Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pricing-footer">
                <p>All plans include 30-day money-back guarantee</p>
                <p>Need a custom plan? <a href="mailto:support@example.com">Contact us</a></p>
            </div>
        </div>
    );
};

export default Pricing;
