<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@travelapp.com',
            'password' => Hash::make('admin123'),
            'is_admin' => 1,
        ]);

        // Create regular users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'is_admin' => 0,
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'is_admin' => 0,
        ]);

        User::create([
            'name' => 'Bob Johnson',
            'email' => 'bob@example.com',
            'password' => Hash::make('password123'),
            'is_admin' => 0,
        ]);

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin credentials: admin@travelapp.com / admin123');
    }
}
