"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ContactForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Step 1: Submit contact details to MongoDB
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname: fullName, phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact");
      }

      // Step 2: Send SMS after successfully saving contact
      setIsSendingSMS(true);
      const smsResponse = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: `Hello ${fullName}, thank you for your submission!`,
        }),
      });

      if (!smsResponse.ok) {
        throw new Error("Failed to send SMS");
      }

      setIsSubmitted(true);
      setIsSendingSMS(false);

      // Trigger confetti effect
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    } catch (error) {
      console.error(error);
      setIsSendingSMS(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Formulaire de contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
            <Input
              id="phoneNumber"
              placeholder="+33 1 23 45 67 89"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              pattern="\+?[0-9]{10,14}"
            />
          </div>
          <Button type="submit" disabled={isSendingSMS}>
            {isSendingSMS ? "Envoi du SMS..." : "Soumettre"}
          </Button>
        </form>
        {isSubmitted && (
          <p className="mt-4 text-green-600">Formulaire soumis avec succès !</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactForm;